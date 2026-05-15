import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { DepositCommand } from './create-deposit.command';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';
import { LiqPayProvider } from '../../infrastructure/payment-providers/liqpay.provider';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction.repository.token';
import type { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet.repository.token';
import type { IWalletRepository } from '../../domain/repositories/wallet.repository';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { WayforpayProvider } from '../../infrastructure/payment-providers/way-for-pay.provider';

@Injectable()
export class CreateDepositUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
    private readonly liqpayProvider: LiqPayProvider,
    private readonly wayforpayProvider: WayforpayProvider,
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
      if (!existing.orderId || !existing.description) {
        throw new BadRequestException(
          'Transaction missing orderId/description',
        );
      }

      if (existing.provider === PaymentProvider.LIQPAY) {
        return this.liqpayProvider.generateDepositCheckout({
          amount: existing.amount,
          currency: existing.currency,
          orderId: existing.orderId,
          description: existing.description,
        });
      }

      if (existing.provider === PaymentProvider.WAYFORPAY) {
        return this.wayforpayProvider.generateDepositCheckout({
          amount: existing.amount,
          currency: existing.currency,
          orderId: existing.orderId,
          description: existing.description,
        });
      }
    }

    const orderId = randomUUID();
    const description = `Deposit via ${provider}`;

    await this.transactionRepo.createTransaction({
      walletId: wallet.id,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING,
      amount,
      currency,
      provider,
      orderId,
      idempotencyKey,
      description,
    });

    if (provider === PaymentProvider.LIQPAY) {
      return this.liqpayProvider.generateDepositCheckout({
        amount,
        currency,
        orderId,
        description,
      });
    }

    if (provider === PaymentProvider.WAYFORPAY) {
      return this.wayforpayProvider.generateDepositCheckout({
        amount,
        currency,
        orderId,
        description,
      });
    }

    throw new BadRequestException('Unsupported provider');
  }
}
