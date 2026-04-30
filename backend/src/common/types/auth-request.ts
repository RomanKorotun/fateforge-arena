import { Request } from 'express';

import { UserRole } from '../../modules/user/domain/enums/user-role.enum';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  sessionId: string;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}
