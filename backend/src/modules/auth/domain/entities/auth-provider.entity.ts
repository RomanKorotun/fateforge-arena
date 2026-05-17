import { AuthProviderEnum } from '../enums/auth-provider.enum';

export class AuthProviderEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly provider: AuthProviderEnum,
    public readonly providerId: string,
  ) {}
}
