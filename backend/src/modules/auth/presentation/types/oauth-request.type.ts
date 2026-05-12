import { Request } from 'express';

import { AuthProviderEnum } from '../../domain/enums/auth-provider.enum';

export interface OAuthProfile {
  provider: AuthProviderEnum;
  providerId: string;
  email?: string;
  name: string;
  avatar?: string;
}

export interface OAuthRequest extends Request {
  user: OAuthProfile;
}
