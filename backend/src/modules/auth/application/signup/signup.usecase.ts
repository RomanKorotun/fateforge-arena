import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { SignupCommand } from './signup.command';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { PasswordHashService } from '../../../../core/security/services/password-hash.service';

@Injectable()
export class SignupUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}
  async execute(command: SignupCommand) {
    const exists = await this.userRepository.findByEmailWithPassword(
      command.email,
    );

    if (exists) {
      throw new ConflictException(
        `User with email ${command.email} already exists`,
      );
    }

    const hashedPassword = await this.passwordHashService.hash(
      command.password,
    );

    const user = await this.userRepository.createUser({
      ...command,
      password: hashedPassword,
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
