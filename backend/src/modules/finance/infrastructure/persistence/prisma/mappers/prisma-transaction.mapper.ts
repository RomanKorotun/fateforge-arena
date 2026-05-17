import { Transaction } from 'prisma/generated';

import { TransactionEntity } from '../../../../domain/entities/transaction.entity';

import { TransactionType } from '../../../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../../../domain/enums/transaction-status.enum';
import { PaymentProvider } from '../../../../domain/enums/payment-provider.enum';

export class PrismaTransactionMapper {
  static toDomain(transaction: Transaction): TransactionEntity {
    return new TransactionEntity(
      transaction.id,
      transaction.walletId,
      transaction.type as TransactionType,
      transaction.status as TransactionStatus,
      transaction.amount.toNumber(),
      transaction.currency,
      transaction.provider as PaymentProvider | undefined,
      transaction.orderId ?? undefined,
      transaction.providerPaymentId ?? undefined,
      transaction.idempotencyKey ?? undefined,
      transaction.description ?? undefined,
    );
  }
}
