import { TransactionEntity } from '../entities/transaction.entity';
import { Currency } from '../enums/currency.enum';
import { PaymentProvider } from '../enums/payment-provider.enum';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionType } from '../enums/transaction-type.enum';

export interface CreateTransactionData {
  walletId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: Currency;
  provider?: PaymentProvider;
  orderId?: string;
  providerPaymentId?: string;
  idempotencyKey?: string;
  description?: string;
}

export interface ITransactionRepository {
  // створення транзакції
  createTransaction(
    data: CreateTransactionData,
    tx?: unknown,
  ): Promise<TransactionEntity>;

  // lock transaction row
  lockByOrderId(
    orderId: string,
    tx?: unknown,
  ): Promise<TransactionEntity | null>;

  // знайти по idempotency key
  findByIdempotencyKey(
    key: string,
    tx?: unknown,
  ): Promise<TransactionEntity | null>;

  // оновити статус
  updateStatus(
    id: string,
    data: {
      status: TransactionStatus;
      providerPaymentId?: string;
    },
    tx?: unknown,
  ): Promise<void>;
}
