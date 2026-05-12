import { AuthProviderEntity } from '../entities/auth-provider.entity';
import { AuthProviderEnum } from '../enums/auth-provider.enum';

export interface CreateAuthProviderData {
  userId: string;
  provider: AuthProviderEnum;
  providerId: string;
}

export interface FindAuthProviderData {
  provider: AuthProviderEnum;
  providerId: string;
}

export interface IAuthProviderRepository {
  create(
    data: CreateAuthProviderData,
    tx?: unknown,
  ): Promise<AuthProviderEntity>;
  findByProviderAndProviderId(
    data: FindAuthProviderData,
    tx?: unknown,
  ): Promise<AuthProviderEntity | null>;
  findByUserId(userId: string, tx?: unknown): Promise<AuthProviderEntity[]>;
}
