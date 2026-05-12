import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';

import {
  CreateAuthProviderData,
  FindAuthProviderData,
  IAuthProviderRepository,
} from '../../../domain/repositories/auth-provider.repository';
import { AuthProviderEntity } from '../../../domain/entities/auth-provider.entity';

import { PrismaAuthProviderMapper } from '../mappers/prisma-auth-provider.mapper';
import { PrismaTx } from '../../../../../core/prisma/prisma.types';

@Injectable()
export class PrismaAuthProviderRepository implements IAuthProviderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: PrismaTx) {
    return tx ?? this.prisma;
  }

  async create(
    { userId, provider, providerId }: CreateAuthProviderData,
    tx?: PrismaTx,
  ) {
    const client = this.getClient(tx);
    const authProvider = await client.authProvider.create({
      data: { userId, provider, providerId },
    });
    return PrismaAuthProviderMapper.toDomain(authProvider);
  }

  async findByProviderAndProviderId(
    { provider, providerId }: FindAuthProviderData,
    tx?: PrismaTx,
  ): Promise<AuthProviderEntity | null> {
    const client = this.getClient(tx);
    const authProvider = await client.authProvider.findUnique({
      where: { provider_providerId: { provider, providerId } },
    });

    return authProvider
      ? PrismaAuthProviderMapper.toDomain(authProvider)
      : null;
  }

  async findByUserId(userId: string, tx?: PrismaTx) {
    const client = this.getClient(tx);
    const authProviders = await client.authProvider.findMany({
      where: { userId },
    });
    return authProviders.map(PrismaAuthProviderMapper.toDomain);
  }
}
