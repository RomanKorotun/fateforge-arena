import { BetType } from '../../../domain/enums/bet-type-enum';
import { UserRole } from '../../../../user/domain/enums/user-role.enum';

export interface GetHistoryGameCommand {
  requesterId: string;
  requesterRole: UserRole;

  userId?: string;
  gameSessionId?: string;

  betType?: BetType;

  from?: string;
  to?: string;

  page: number;
  limit: number;
}
