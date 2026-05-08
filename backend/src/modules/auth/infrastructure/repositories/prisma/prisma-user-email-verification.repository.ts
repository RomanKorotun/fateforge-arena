import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/prisma/prisma.service';

import {
  CreateEmailVerificationData,
  IUserEmailVerificationRepository,
} from '../../../domain/repositories/user-email-verification.repository';

import { PrismaUserEmailVerificationMapper } from '../mappers/prisma-user-email-verification.mapper';
import { UserEmailVerificationEntity } from 'src/modules/auth/domain/entities/user-email-verefication.entity';

@Injectable()
export class PrismaUserEmailVerificationRepository implements IUserEmailVerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEmailVerificationData) {
    const verification = await this.prisma.userEmailVerification.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
      },
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
}
