import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UNIT_OF_WORK } from '../../../../common/tokens/unit-of-work.token';
import type { IUnitOfWork } from '../../../../common/contracts/unit-of-work.interface';

import { PasswordHashService } from '../../../../core/security/services/password-hash.service';
import { EmailService } from '../../../../core/email/email.service';

import { EMAIL_VERIFICATION_EXPIRATION_MINUTES } from '../../../../common/constants/auth.constants';

import { SignupCommand } from './signup.command';

import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import type { IProfileRepository } from '../../../user/domain/repositories/profile.repository';
import { PROFILE_REPOSITORY } from '../../../user/domain/repositories/profile.repository.token';

import { USER_EMAIL_VERIFICATION_REPOSITORY } from '../../domain/repositories/user-email-verification.repository.token';
import type { IUserEmailVerificationRepository } from '../../domain/repositories/user-email-verification.repository';

@Injectable()
export class SignupUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(USER_EMAIL_VERIFICATION_REPOSITORY)
    private readonly userEmailVerificationRepo: IUserEmailVerificationRepository,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepo: IProfileRepository,
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

    // TRANSACTION
    const user = await this.unitOfWork.transaction(async (tx) => {
      const user = await this.userRepo.createUser(
        { ...command, password: hashedPassword },
        tx,
      );

      await this.profileRepo.createProfile(user.id, tx);

      return user;
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
      email: user.email!,
      username: user.username,
      confirmationLink: `${BACKEND_URL}/auth/confirm-email?token=${token}`,
    });

    return {
      message:
        'Ваш акаунт створено. Для завершення реєстрації підтвердіть електронну пошту.',
    };
  }
}
