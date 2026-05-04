import { Injectable } from '@nestjs/common';

import { UserQueryService } from '../../../infrastructure/prisma/query/prisma-user-query.service';

@Injectable()
export class getMeUseCase {
  constructor(private readonly userQueryService: UserQueryService) {}
  async execute(id: string) {
    return await this.userQueryService.getFullUserProfileById(id);
  }
}
