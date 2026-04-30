import { Inject, Injectable } from '@nestjs/common';

import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import { BanUserCommand } from './ban-user.command';

@Injectable()
export class BanUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async execute({ id, data: { banEndAt } }: BanUserCommand) {
    const user = await this.userRepository.updateUser(id, {
      isBanned: true,
      banEndAt: new Date(banEndAt),
    });
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isBanned: user.isBanned,
      banEndAt: user.banEndAt,
    };
  }
}
