import { UserRole } from '../enums/user-role.enum';
import { AddressEntity } from './address.entity';
import { ProfileEntity } from './profile.entity';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly lastLoginIp: string | null,
    public readonly lastLoginAt: Date | null,
    public readonly isBanned: boolean,
    public readonly banEndAt: Date | null,
    public readonly isDeleted: boolean,
    public readonly detetedAt: Date | null,
    public readonly createdAt: Date,
    public readonly profile?: ProfileEntity | null,
    public readonly address?: AddressEntity | null,
  ) {}
}
