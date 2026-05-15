import { Currency } from '../../domain/enums/currency.enum';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

export interface DepositCommand {
  idempotencyKey: string;
  walletId: string;
  userId: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
}
