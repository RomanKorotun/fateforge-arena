import { AuthProvider } from 'prisma/generated';

import { AuthProviderEntity } from '../../../domain/entities/auth-provider.entity';
import { AuthProviderEnum } from '../../../domain/enums/auth-provider.enum';

export class PrismaAuthProviderMapper {
  static toDomain(model: AuthProvider): AuthProviderEntity {
    return new AuthProviderEntity(
      model.id,
      model.userId,
      model.provider as AuthProviderEnum,
      model.providerId,
    );
  }

  static toPersistence(entity: AuthProviderEntity) {
    return {
      userId: entity.userId,
      provider: entity.provider,
      providerId: entity.providerId,
    };
  }
}
