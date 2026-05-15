import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import type { IWalletRepository } from '../../domain/repositories/wallet.repository';

import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction.repository.token';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet.repository.token';

import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { HandlePaymentWebhookCommand } from './handle-deposit-webhook.command';

import { UNIT_OF_WORK } from '../../../../common/tokens/unit-of-work.token';
import type { IUnitOfWork } from '../../../../common/contracts/unit-of-work.interface';

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

  async execute({
    orderId,
    transactionId,
    status,
  }: HandlePaymentWebhookCommand) {
    return await this.unitOfWork.transaction(async (tx) => {
      // LOCK transaction row
      const transaction = await this.transactionRepo.lockByOrderId(orderId, tx);

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      // idempotency check
      if (
        transaction.status === TransactionStatus.COMPLETED ||
        transaction.status === TransactionStatus.FAILED
      ) {
        return { ok: true };
      }

      const isSuccess = status === TransactionStatus.COMPLETED;

      // LOCK wallet row
      await this.walletRepo.lockById(transaction.walletId, tx);

      // update transaction status
      await this.transactionRepo.updateStatus(
        transaction.id,
        {
          status: isSuccess
            ? TransactionStatus.COMPLETED
            : TransactionStatus.FAILED,
          providerPaymentId: transactionId,
        },
        tx,
      );

      // update wallet balance
      if (isSuccess) {
        await this.walletRepo.increaseBalance(
          transaction.walletId,
          transaction.amount,
          tx,
        );
      }

      return { ok: true };
    });
  }
}
