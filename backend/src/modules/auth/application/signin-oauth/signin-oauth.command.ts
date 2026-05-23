import { AuthProviderEnum } from '../../domain/enums/auth-provider.enum';

export interface OAuthProfile {
  provider: AuthProviderEnum;
  providerId: string;
  email?: string;
  name: string;
  avatar?: string;
}

export interface Device {
  browser: string;
  os: string;
  type: string;
}

export interface Geo {
  country: string | null;
  region: string | null;
  city: string | null;
}

export interface SigninOauthCommand {
  oauthProfile: OAuthProfile;
  ip: string;
  device: Device;
  geo: Geo;
}
