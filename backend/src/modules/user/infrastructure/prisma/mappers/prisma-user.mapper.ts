import { User } from 'prisma/generated';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserEntityWithPassword } from '../../../domain/entities/user-with-password.type';
import { UserRole } from '../../../domain/enums/user-role.enum';

export class PrismaUserMapper {
  static toDomain(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.username,
      user.email,
      user.role as UserRole,
      user.lastLoginIP,
      user.lastLoginAt,
      user.isBanned,
      user.banEndAt,
      user.isDeleted,
      user.deletedAt,
      user.createdAt,
    );
  }

  static toDomainWithPassword(user: User): UserEntityWithPassword {
    const base = this.toDomain(user);

    return {
      ...base,
      password: user.password,
    };
  }
}
