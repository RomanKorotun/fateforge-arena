import { UserEntityWithPassword } from '../entities/user-with-password.type';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export interface CreateUserData {
  username: string;
  email: string;
  password?: string;
}

export interface FindAllUsersData {
  skip: number;
  limit: number;
  role?: UserRole;
  isBanned?: boolean;
  isDeleted?: boolean;
}

export type UpdateUserData = Partial<{
  username: string;
  email: string;
  password: string;
  role: UserRole;
  emailVerifiedAt: Date;
  lastLoginIP: string;
  lastLoginAt: Date;
  isBanned: boolean;
  banEndAt: Date | null;
  isDeleted: boolean;
  deletedAt: Date | null;
}>;

export interface UpdateAvatar {
  userId: string;
  avatar: string;
}

export interface IUserRepository {
  createUser(data: CreateUserData, tx?: unknown): Promise<UserEntity>;
  findByEmail(email: string, tx?: unknown): Promise<UserEntity | null>;
  findByEmailWithPassword(
    email: string,
    tx?: unknown,
  ): Promise<UserEntityWithPassword | null>;
  findById(id: string, tx?: unknown): Promise<UserEntity | null>;
  updateUser(
    userId: string,
    data: UpdateUserData,
    tx?: unknown,
  ): Promise<UserEntity>;
  findAllUsers(params: FindAllUsersData, tx?: unknown): Promise<UserEntity[]>;
}
