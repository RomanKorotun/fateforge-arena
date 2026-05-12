import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';

import {
  CreateEmailVerificationData,
  IUserEmailVerificationRepository,
  UpdateEmailVerificationData,
} from '../../../domain/repositories/user-email-verification.repository';
import { UserEmailVerificationEntity } from '../../../domain/entities/user-email-verefication.entity';

import { PrismaUserEmailVerificationMapper } from '../mappers/prisma-user-email-verification.mapper';

@Injectable()
export class PrismaUserEmailVerificationRepository implements IUserEmailVerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create({ userId, token, expiresAt }: CreateEmailVerificationData) {
    const verification = await this.prisma.userEmailVerification.create({
      data: { userId, token, expiresAt },
    });
    return PrismaUserEmailVerificationMapper.toDomain(verification);
  }

  async findByToken(
    token: string,
  ): Promise<UserEmailVerificationEntity | null> {
    const verification = await this.prisma.userEmailVerification.findFirst({
      where: { token },
    });

    return verification
      ? PrismaUserEmailVerificationMapper.toDomain(verification)
      : null;
  }

  async save(entity: UserEmailVerificationEntity) {
    const data = PrismaUserEmailVerificationMapper.toPersistence(entity);
    const updated = await this.prisma.userEmailVerification.update({
      where: { id: entity.getId() },
      data,
    });
    return PrismaUserEmailVerificationMapper.toDomain(updated);
  }

  async updateByUserId({
    userId,
    token,
    expiresAt,
    usedAt,
  }: UpdateEmailVerificationData) {
    const verification = await this.prisma.userEmailVerification.update({
      where: { userId },
      data: { token, expiresAt, usedAt },
    });
    return PrismaUserEmailVerificationMapper.toDomain(verification);
  }
}
