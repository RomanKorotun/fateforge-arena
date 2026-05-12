import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';

import {
  IProfileRepository,
  UpdateAvatarData,
} from '../../../domain/repositories/profile.repository';
import { ProfileEntity } from '../../../domain/entities/profile.entity';

import { PrismaProfileMapper } from '../mappers/prisma-profile.mapper';
import { PrismaTx } from '../../../../../core/prisma/prisma.types';

@Injectable()
export class PrismaProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: PrismaTx) {
    return tx ?? this.prisma;
  }

  async createProfile(userId: string, tx?: PrismaTx): Promise<ProfileEntity> {
    const client = this.getClient(tx);
    const profile = await client.profile.create({
      data: { userId, rating: 0, level: 0 },
    });
    return PrismaProfileMapper.toDomain(profile);
  }

  // додавання або оновлення аватара
  async updateAvatar(
    { userId, avatar }: UpdateAvatarData,
    tx?: PrismaTx,
  ): Promise<void> {
    const client = this.getClient(tx);
    await client.profile.update({
      where: { userId },
      data: { avatar },
    });
  }

  // пошук профілю по userId
  async findByUserId(
    userId: string,
    tx?: PrismaTx,
  ): Promise<ProfileEntity | null> {
    const client = this.getClient(tx);
    const profile = await client.profile.findUnique({
      where: { userId },
    });
    return profile ? PrismaProfileMapper.toDomain(profile) : null;
  }
}
