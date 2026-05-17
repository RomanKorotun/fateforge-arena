import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';

import type {
  CreateSeedData,
  IUserSeedRepository,
} from '../../../domain/repositories/user-seed.repository';
import { UserSeedEntity } from '../../../domain/entities/user-seed.entity';

import { PrismaUserSeedMapper } from '../mappers/prisma-user-seed.mapper';

@Injectable()
export class PrismaUserSeedRepository implements IUserSeedRepository {
  constructor(private readonly prisma: PrismaService) {}

  // створює або оновлює сід
  async upsertSeed({
    userId,
    clientSeed,
  }: CreateSeedData): Promise<UserSeedEntity> {
    const seed = await this.prisma.userSeed.upsert({
      where: { userId },
      update: { clientSeed },
      create: { userId, clientSeed },
    });
    return PrismaUserSeedMapper.toDomain(seed);
  }

  // отримати сід
  async getSeed(userId: string): Promise<UserSeedEntity | null> {
    const seed = await this.prisma.userSeed.findUnique({
      where: { userId },
    });
    return seed ? PrismaUserSeedMapper.toDomain(seed) : null;
  }
}
