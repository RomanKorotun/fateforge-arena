import { UserEmailVerificationEntity } from '../entities/user-email-verefication.entity';

export interface CreateEmailVerificationData {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface IUserEmailVerificationRepository {
  create(
    data: CreateEmailVerificationData,
  ): Promise<UserEmailVerificationEntity>;
  findByToken(token: string): Promise<UserEmailVerificationEntity | null>;

  save(
    entity: UserEmailVerificationEntity,
  ): Promise<UserEmailVerificationEntity>;
}
