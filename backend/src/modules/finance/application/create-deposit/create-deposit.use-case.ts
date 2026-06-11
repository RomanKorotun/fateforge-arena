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

  async execute(params: DepositCommand) {
    const {
      idempotencyKey,
      walletId,
      userId,
      amount,
      currency,
      provider,
    } = params;

    // 1. Перевіряємо існування гаманця і права доступу користувача
    const wallet = await this.walletRepo.findByIdAndUserId(walletId, userId);

    if (!wallet) {
      throw new NotFoundException('Гаманець не знайдено');
    }

    // 2. Idempotency protection
    //
    // Захист від дублювання депозиту при:
    // - double click
    // - retry запитах
    // - повторній відправці з фронта
    //
    // Один idempotencyKey = одна фінансова операція
    const existing =
      await this.transactionRepo.findByIdempotencyKey(idempotencyKey);

    // якщо вже створено — просто повертаємо існуючу транзакцію
    if (existing) {
      return existing;
    }

    // 3. Створюємо унікальний orderId для payment provider (Stripe)
    // Це потрібно для зв’язки webhook → внутрішня транзакція
    const orderId = randomUUID();

    const description = `Deposit via ${provider}`;

    // 4. Створюємо PENDING транзакцію ДО виклику payment provider
    //
    // Це гарантує:
    // - фінансова операція вже зафіксована в БД
    // - webhook зможе її оновити
    // - немає втрати стану між системами
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

    // 5. Виклик payment provider
    if (provider === PaymentProvider.STRIPE) {
      const result = await this.stripeProvider.createCheckoutSession({
        amount,
        currency,
        orderId,
        description,
      });

      return result;
    }

    // 6. Захист від непідтримуваних провайдерів
    throw new BadRequestException('Unsupported provider');
  }
}