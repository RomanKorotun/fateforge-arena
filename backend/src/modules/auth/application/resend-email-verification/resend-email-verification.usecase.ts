import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EMAIL_VERIFICATION_EXPIRATION_MINUTES } from '../../../../common/constants/auth.constants';

import { EmailService } from '../../../../core/email/email.service';

import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';

import { USER_EMAIL_VERIFICATION_REPOSITORY } from '../../domain/repositories/user-email-verification.repository.token';
import type { IUserEmailVerificationRepository } from '../../domain/repositories/user-email-verification.repository';

@Injectable()
export class ResendEmailVerificationUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(USER_EMAIL_VERIFICATION_REPOSITORY)
    private readonly userEmailVerificationRepo: IUserEmailVerificationRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (user.emailVerifiedAt) {
      throw new BadRequestException('Email вже підтверджено');
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(
      Date.now() + 1000 * 60 * EMAIL_VERIFICATION_EXPIRATION_MINUTES,
    );

    await this.userEmailVerificationRepo.updateByUserId({
      userId: user.id,
      token,
      expiresAt,
      usedAt: null,
    });

    const BACKEND_URL = this.configService.getOrThrow('BACKEND_URL');

    await this.emailService.sendVerificationEmail({
      email: user.email,
      username: user.username,
      confirmationLink: `${BACKEND_URL}/auth/confirm-email?token=${token}`,
    });

    return {
      message: 'Лист для підтвердження електронної адреси надіслано повторно',
    };
  }
}
