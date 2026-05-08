import { UserSeed } from 'prisma/generated';
import { UserSeedEntity } from '../../../domain/entities/user-seed.entity';

export class PrismaUserSeedMapper {
  static toDomain(seed: UserSeed): UserSeedEntity {
    return new UserSeedEntity(seed.userId, seed.clientSeed);
  }
}
