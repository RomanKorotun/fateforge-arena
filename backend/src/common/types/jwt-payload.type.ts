import { UserRole } from '../../modules/user/domain/enums/user-role.enum';

export interface JwtPayload {
  id: string;
  role: UserRole;
  sessionId: string;
}
