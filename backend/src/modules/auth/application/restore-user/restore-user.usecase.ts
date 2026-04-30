import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { RestoreUserCommand } from './restore-user.command';
import { PasswordHashService } from '../../../../core/security/services/password-hash.service';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';

@Injectable()
export class RestoreUserUseCase {
  constructor(
    private readonly passwordHashService: PasswordHashService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: RestoreUserCommand) {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHashService.compare(
      command.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isDeleted) {
      throw new UnauthorizedException('Account is not deleted');
    }

    const restoredUser = await this.userRepository.updateUser(user.id, {
      isDeleted: false,
      deletedAt: null,
    });

    return {
      id: restoredUser.id,
      email: restoredUser.email,
      username: restoredUser.username,
      restored: true,
    };
  }
}
