// get-transactions.command.ts

import { Currency } from '../../domain/enums/currency.enum';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

import { UserRole } from '../../../user/domain/enums/user-role.enum';

export interface GetTransactionsCommand {
  requesterId: string;
  requesterRole: UserRole;
  userId?: string;
  walletId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  provider?: PaymentProvider;
  currency?: Currency;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}
