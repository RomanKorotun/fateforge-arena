import { Inject, Injectable } from '@nestjs/common';

import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';

import { RevokeUserSessionsUseCase } from '../revoke-user-sessions/revoke-user-sessions.usecase';

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly revokeUserSessionsUseCase: RevokeUserSessionsUseCase,
  ) {}
  async execute(id: string) {
    await this.revokeUserSessionsUseCase.execute(id);
    await this.userRepository.updateUser(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    return { message: 'Account deleted successfully' };
  }
}
