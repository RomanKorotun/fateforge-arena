import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';

@Injectable()
export class UnBanUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async execute(id: string) {
    const user = await this.userRepository.updateUser(id, {
      isBanned: false,
      banEndAt: null,
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
