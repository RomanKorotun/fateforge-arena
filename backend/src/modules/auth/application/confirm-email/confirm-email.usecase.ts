import {
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { USER_EMAIL_VERIFICATION_REPOSITORY } from '../../domain/repositories/user-email-verification.repository.token';
import type { IUserEmailVerificationRepository } from '../../domain/repositories/user-email-verification.repository';

import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';

@Injectable()
export class ConfirmEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(USER_EMAIL_VERIFICATION_REPOSITORY)
    private readonly userEmailVerificationRepo: IUserEmailVerificationRepository,
  ) {}

  async execute(token: string) {
    const verification =
      await this.userEmailVerificationRepo.findByToken(token);

    if (!verification) {
      throw new NotFoundException('Invalid token');
    }

    if (verification.isUsed()) {
      return { message: 'Email already confirmed' };
    }

    if (verification.isExpired()) {
      throw new GoneException('Token expired');
    }

    verification.use();
    await this.userEmailVerificationRepo.save(verification);

    await this.userRepo.updateUser(verification.getUserId(), {
      emailVerifiedAt: new Date(),
    });

    return { message: 'Email успішно підтверджено' };
  }
}
