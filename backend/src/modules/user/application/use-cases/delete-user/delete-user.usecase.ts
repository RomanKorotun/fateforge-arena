import { Inject, Injectable } from '@nestjs/common';

import type { IUserRepository } from '../../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository.token';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async execute(id: string) {
    await this.userRepository.updateUser(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    return { message: 'Account deleted successfully' };
  }
}
