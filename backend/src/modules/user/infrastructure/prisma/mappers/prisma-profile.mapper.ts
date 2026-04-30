import { Profile } from 'prisma/generated';
import { ProfileEntity } from '../../../domain/entities/profile.entity';

export class PrismaProfileMapper {
  static toDomain(profile: Profile): ProfileEntity {
    return new ProfileEntity(
      profile.userId,
      profile.rating,
      profile.balance.toNumber(),
      profile.level,
      profile.avatar ?? null,
    );
  }
}
