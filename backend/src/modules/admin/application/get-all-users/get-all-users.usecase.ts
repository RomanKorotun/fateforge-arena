import { Inject, Injectable } from '@nestjs/common';

import { createPagination } from '../../../../common/helpers/pagination.helper';

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
    const { data, total } = await this.userRepository.findAllUsers({
      page,
      limit,
      role: UserRole.USER,
      isBanned,
      isDeleted,
    });

    const pagination = createPagination({ page, limit, totalItems: total });

    return { users: data, pagination };
  }
}
