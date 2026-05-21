import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { DepositCommand } from './create-deposit.command';

import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

import { StripeProvider } from '../../infrastructure/payment-providers/stripe.provider';

import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction/transaction.repository.token';
import type { ITransactionRepository } from '../../domain/repositories/transaction/transaction.repository';

import { WALLET_REPOSITORY } from '../../domain/repositories/wallet/wallet.repository.token';
import type { IWalletRepository } from '../../domain/repositories/wallet/wallet.repository';

import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

@Injectable()
export class CreateDepositUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
    private readonly stripeProvider: StripeProvider,
  ) {}

  async execute({
    idempotencyKey,
    walletId,
    userId,
    amount,
    currency,
    provider,
  }: DepositCommand) {
    const wallet = await this.walletRepo.findByIdAndUserId(walletId, userId);

    if (!wallet) {
      throw new NotFoundException('Гаманець не знайдено');
    }

    const existing =
      await this.transactionRepo.findByIdempotencyKey(idempotencyKey);

    if (existing) {
      return existing;
    }

    const orderId = randomUUID();
    const description = `Deposit via ${provider}`;

    await this.transactionRepo.createTransaction({
      walletId: wallet.id,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING,
      amount,
      currency,
      balanceBefore: wallet.balance,
      provider,
      orderId,
      idempotencyKey,
      description,
    });

    if (provider === PaymentProvider.STRIPE) {
      return this.stripeProvider.createCheckoutSession({
        amount,
        currency,
        orderId,
        description,
      });
    }

    throw new BadRequestException('Unsupported provider');
  }
}


