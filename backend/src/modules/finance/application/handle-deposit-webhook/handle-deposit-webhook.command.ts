import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

export interface HandlePaymentWebhookCommand {
  orderId: string;
  provider: PaymentProvider;
  status: string;
  amount: number;
  transactionId: string;
}
