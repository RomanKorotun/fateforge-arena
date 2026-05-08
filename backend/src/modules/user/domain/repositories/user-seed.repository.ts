import { UserSeedEntity } from '../entities/user-seed.entity';

export interface CreateSeedData {
  userId: string;
  clientSeed: string;
}

export interface IUserSeedRepository {
  getSeed(userId: string): Promise<UserSeedEntity | null>;
  upsertSeed(data: CreateSeedData): Promise<UserSeedEntity>;
}
