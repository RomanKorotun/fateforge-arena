import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction.repository.token';
import type { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet.repository.token';
import type { IWalletRepository } from '../../domain/repositories/wallet.repository';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { UNIT_OF_WORK } from '../../../../common/tokens/unit-of-work.token';
import type { IUnitOfWork } from '../../../../common/contracts/unit-of-work.interface';
import { WithdrawCommand } from './withdraw.command';

@Injectable()
export class WithdrawUseCase {
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
  }: WithdrawCommand) {
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

      // already processed
      if (existing) {
        return existing;
      }

      // insufficient funds
      if (wallet.balance < amount) {
        throw new BadRequestException('Недостатньо коштів');
      }

      const orderId = randomUUID();

      // create transaction
      const transaction = await this.transactionRepo.createTransaction(
        {
          walletId: wallet.id,
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.COMPLETED,
          amount,
          currency,
          provider,
          orderId,
          idempotencyKey,
          description: `Withdraw`,
        },
        tx,
      );

      // decrement balance
      await this.walletRepo.decreaseBalance(wallet.id, amount, tx);

      return transaction;
    });
  }
}
