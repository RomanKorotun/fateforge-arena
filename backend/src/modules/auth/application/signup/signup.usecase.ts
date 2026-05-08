import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SignupCommand } from './signup.command';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { PasswordHashService } from '../../../../core/security/services/password-hash.service';
import { EmailService } from '../../../../core/email/email.service';
import { USER_EMAIL_VERIFICATION_REPOSITORY } from '../../domain/repositories/user-email-verification.repository.token';
import type { IUserEmailVerificationRepository } from '../../domain/repositories/user-email-verification.repository';
import { EMAIL_VERIFICATION_EXPIRATION_MINUTES } from '../../../../common/constants/auth.constants';

@Injectable()
export class SignupUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(USER_EMAIL_VERIFICATION_REPOSITORY)
    private readonly userEmailVerificationRepo: IUserEmailVerificationRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}
  async execute(command: SignupCommand) {
    const exists = await this.userRepo.findByEmailWithPassword(command.email);

    if (exists) {
      throw new ConflictException(
        `User with email ${command.email} already exists`,
      );
    }

    const hashedPassword = await this.passwordHashService.hash(
      command.password,
    );

    const user = await this.userRepo.createUser({
      ...command,
      password: hashedPassword,
    });

    const token = crypto.randomUUID();
    const expiresAt = new Date(
      Date.now() + 1000 * 60 * EMAIL_VERIFICATION_EXPIRATION_MINUTES,
    );

    await this.userEmailVerificationRepo.create({
      userId: user.id,
      token,
      expiresAt,
    });

    const BACKEND_URL = this.configService.getOrThrow('BACKEND_URL');

    await this.emailService.sendVerificationEmail({
      email: user.email,
      username: user.username,
      confirmationLink: `${BACKEND_URL}/auth/confirm-email?token=${token}`,
    });

    return {
      message:
        'Ваш акаунт створено. Для завершення реєстрації підтвердіть електронну пошту.',
    };
  }
}
