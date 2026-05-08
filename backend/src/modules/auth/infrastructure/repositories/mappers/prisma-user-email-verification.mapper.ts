import { UserEmailVerification } from 'prisma/generated';

import { UserEmailVerificationEntity } from '../../../domain/entities/user-email-verefication.entity';

export class PrismaUserEmailVerificationMapper {
  static toDomain(
    verification: UserEmailVerification,
  ): UserEmailVerificationEntity {
    return new UserEmailVerificationEntity(
      verification.id,
      verification.userId,
      verification.token,
      verification.expiresAt,
      verification.usedAt,
      verification.createdAt,
    );
  }

  static toPersistence(entity: UserEmailVerificationEntity) {
    return {
      token: entity.getToken(),
      expiresAt: entity.getExpiresAt(),
      usedAt: entity.getUsedAt(),
    };
  }
}
