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
    console.log('\n================ WEBHOOK USE CASE ================');
    console.log('📥 INPUT:', cmd);

    const { orderId, transactionId, status } = cmd;

    return this.unitOfWork.transaction(async (tx) => {
      console.log('🧩 TX STARTED');

      const transaction = await this.transactionRepo.lockByOrderId(orderId, tx);

      console.log('🔍 TRANSACTION FOUND:', transaction);

      if (!transaction) {
        console.log('❌ TRANSACTION NOT FOUND BY ORDER ID');
        throw new NotFoundException('Transaction not found');
      }

      console.log('📊 CURRENT STATUS:', transaction.status);

      if (transaction.status !== TransactionStatus.PENDING) {
        console.log('⚠️ SKIP → NOT PENDING');
        return { ok: true };
      }

      const wallet = await this.walletRepo.lockById(transaction.walletId, tx);

      console.log('💰 WALLET FOUND:', wallet);

      if (!wallet) {
        console.log('❌ WALLET NOT FOUND');
        throw new NotFoundException('Wallet not found');
      }

      const balanceBefore = wallet.balance;

      console.log('💵 BALANCE BEFORE:', balanceBefore);
      console.log('💸 TRANSACTION AMOUNT:', transaction.amount);

      const isSuccess = status === TransactionStatus.COMPLETED;

      let balanceAfter = balanceBefore;

      if (isSuccess) {
        balanceAfter = balanceBefore + transaction.amount;

        console.log('➕ APPLYING BALANCE INCREASE');
        console.log('➡️ NEW BALANCE:', balanceAfter);

        await this.walletRepo.increaseBalance(
          transaction.walletId,
          transaction.amount,
          tx,
        );

        console.log('✅ WALLET UPDATED');
      } else {
        console.log('❌ PAYMENT FAILED → NO BALANCE CHANGE');
      }

      console.log('🧾 UPDATING TRANSACTION...');

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

      console.log('✅ TRANSACTION UPDATED');

      console.log('================ USE CASE END ================\n');

      return { ok: true };
    });
  }
}
