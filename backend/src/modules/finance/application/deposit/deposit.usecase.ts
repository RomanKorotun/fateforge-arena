import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction.repository.token';
import type { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet.repository.token';
import type { IWalletRepository } from '../../domain/repositories/wallet.repository';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { UNIT_OF_WORK } from '../../../../common/tokens/unit-of-work.token';
import type { IUnitOfWork } from '../../../../common/contracts/unit-of-work.interface';
import { DepositCommand } from './deposit.command';

@Injectable()
export class DepositUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute({
    idempotencyKey,
    walletId,
    userId,
    amount,
    currency,
    provider,
  }: DepositCommand) {
    return this.unitOfWork.transaction(async (tx) => {
      // LOCK wallet row
      const wallet = await this.walletRepo.lockById(walletId, tx);

      if (!wallet || wallet.userId !== userId) {
        throw new NotFoundException('Гаманець не знайдено');
      }

      // idempotency check
      const existing = await this.transactionRepo.findByIdempotencyKey(
        idempotencyKey,
        tx,
      );

      // якщо вже була така операція
      if (existing) {
        return existing;
      }

      const orderId = randomUUID();

      const transaction = await this.transactionRepo.createTransaction(
        {
          walletId: wallet.id,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.COMPLETED,
          amount,
          currency,
          provider,
          orderId,
          idempotencyKey,
          description: `Deposit via ${provider}`,
        },
        tx,
      );

      // balance increment
      await this.walletRepo.increaseBalance(wallet.id, amount, tx);

      return transaction;
    });
  }
}
