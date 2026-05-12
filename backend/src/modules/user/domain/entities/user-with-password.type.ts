import { UserEntity } from './user.entity';

export type UserEntityWithPassword = UserEntity & {
  password: string | null;
};
