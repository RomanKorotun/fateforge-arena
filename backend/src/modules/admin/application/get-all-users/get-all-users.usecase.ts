import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { UserRole } from '../../../user/domain/enums/user-role.enum';
import { GetAllUsersCommand } from './get-all-users.command';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ page, limit, isBanned, isDeleted }: GetAllUsersCommand) {
    const skip = (page - 1) * limit;
    return await this.userRepository.findAllUsers({
      skip,
      limit,
      role: UserRole.USER,
      isBanned,
      isDeleted,
    });
  }
}
