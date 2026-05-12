import { ProfileEntity } from '../entities/profile.entity';

export interface CreateProfileData {
  userId: string;
}

export interface UpdateAvatarData {
  userId: string;
  avatar: string;
}

export interface IProfileRepository {
  createProfile(userId: string, tx?: unknown): Promise<ProfileEntity>;
  updateAvatar(data: UpdateAvatarData, tx?: unknown): Promise<void>;
  findByUserId(userId: string, tx?: unknown): Promise<ProfileEntity | null>;
}
