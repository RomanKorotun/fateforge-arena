import { UserEntity } from '../entities/user.entity';
import { CreateUserData } from '../types/create-user.data';
import { UpdateLastSigninData } from '../types/update-last-signin.data';

export interface FindAllUsersData {
  skip: number;
  limit: number;
  role?: number;
  isBanned?: boolean;
}

export type UpdateUserData = Partial<{
  username: string;
  email: string;
  password: string;
  isBanned: boolean;
  banEndAt: Date | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  role: number;
  lastLoginIP: string;
  lastLoginAt: Date;
}>;

export interface UpdateAvatar {
  userId: string;
  avatar: string;
}

export interface IUserRepository {
  createUser(data: CreateUserData): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  updateLastSignin(data: UpdateLastSigninData): Promise<void>;
  updateUser(userId: string, data: UpdateUserData): Promise<UserEntity>;
  findAllUsers(params: FindAllUsersData): Promise<UserEntity[]>;
  updateAvatar(data: UpdateAvatar): Promise<void>;
}
