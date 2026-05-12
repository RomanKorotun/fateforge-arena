import { AuthProviderEnum } from '../../domain/enums/auth-provider.enum';

export interface OAuthProfile {
  provider: AuthProviderEnum;
  providerId: string;
  email?: string;
  name: string;
  avatar?: string;
}

export interface SigninOauthCommand {
  oauthProvider: AuthProviderEnum;
  oauthProfile: OAuthProfile;
  ip: string;
  device: {
    browser: string;
    os: string;
    type: string;
  };
}
