import { Currency } from '../../../../finance/domain/enums/currency.enum';
import { UserRole } from '../../../../user/domain/enums/user-role.enum';

export interface GetVideoslotHistoryCommand {
  requesterId: string;
  requesterRole: UserRole;
  userId?: string;
  gameId?: string;
  currency?: Currency;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}
