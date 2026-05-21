import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

export interface HandleDepositWebhookCommand {
  orderId: string;
  provider: PaymentProvider;
  status: string;
  amount: number;
  transactionId: string;
}
