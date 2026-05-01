import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';

@Injectable()
export class UnBanUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.updateUser(id, {
      isBanned: false,
      banEndAt: null,
    });

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      isBanned: updatedUser.isBanned,
      banEndAt: updatedUser.banEndAt,
    };
  }
}
