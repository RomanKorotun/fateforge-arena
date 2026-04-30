import { User, Profile, Address } from 'prisma/generated';
import { UserEntity } from '../../../domain/entities/user.entity';
import { PrismaProfileMapper } from './prisma-profile.mapper';
import { PrismaAddressMapper } from './prisma-address.mapper';

export class PrismaUserMapper {
  static toDomain(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.username,
      user.email,
      user.password,
      user.role,
      user.lastLoginIP,
      user.lastLoginAt,
      user.isBanned,
      user.banEndAt,
      user.isDeleted,
      user.deletedAt,
      user.createdAt,
    );
  }

  static toDomainWithRelations(
    user: User & {
      profile: Profile | null;
      address: Address | null;
    },
  ): UserEntity {
    return new UserEntity(
      user.id,
      user.username,
      user.email,
      user.password,
      user.role,
      user.lastLoginIP,
      user.lastLoginAt,
      user.isBanned,
      user.banEndAt,
      user.isDeleted,
      user.deletedAt,
      user.createdAt,
      user.profile ? PrismaProfileMapper.toDomain(user.profile) : null,
      user.address ? PrismaAddressMapper.toDomain(user.address) : null,
    );
  }
}
