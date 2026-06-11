import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction/transaction.repository.token';
import type { ITransactionRepository } from '../../domain/repositories/transaction/transaction.repository';

import { WALLET_REPOSITORY } from '../../domain/repositories/wallet/wallet.repository.token';
import type { IWalletRepository } from '../../domain/repositories/wallet/wallet.repository';

import { UNIT_OF_WORK } from '../../../../common/tokens/unit-of-work.token';
import type { IUnitOfWork } from '../../../../common/contracts/unit-of-work.interface';

import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

@Injectable()
export class HandleDepositWebhookUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(cmd: any) {
    const { orderId, transactionId, status } = cmd;

    // 1. Якщо транзакція вже не PENDING — вихід без змін
    // 2. wallet блокується через SELECT ... FOR UPDATE,щоб уникнути race condition при паралельних webhook запитах
    // 3. баланс і статус транзакції оновлюються атомарно в межах однієї БД транзакції
    return this.unitOfWork.transaction(async (tx) => {
      const transaction = await this.transactionRepo.lockByOrderId(orderId, tx);

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      if (transaction.status !== TransactionStatus.PENDING) {
        return { ok: true };
      }

      const wallet = await this.walletRepo.lockById(transaction.walletId, tx);

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      const balanceBefore = wallet.balance;

      let balanceAfter = balanceBefore;

      const isSuccess = status === TransactionStatus.COMPLETED;

      if (isSuccess) {
        balanceAfter = balanceBefore + transaction.amount;

        await this.walletRepo.increaseBalance(
          transaction.walletId,
          transaction.amount,
          tx,
        );
      }

      await this.transactionRepo.updateStatus(
        transaction.id,
        {
          status: isSuccess
            ? TransactionStatus.COMPLETED
            : TransactionStatus.FAILED,
          providerPaymentId: transactionId,
          balanceAfter,
        },
        tx,
      );

      return { ok: true };
    });
  }
}
