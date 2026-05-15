import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionType } from '../enums/transaction-type.enum';
import { PaymentProvider } from '../enums/payment-provider.enum';

export class TransactionEntity {
  constructor(
    public id: string,
    public walletId: string,
    public type: TransactionType,
    public status: TransactionStatus,
    public amount: number,
    public currency: string,
    public provider?: PaymentProvider,
    public orderId?: string,
    public providerPaymentId?: string,
    public idempotencyKey?: string,
    public description?: string,
  ) {}
}
