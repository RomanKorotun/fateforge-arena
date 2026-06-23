import { Injectable } from '@nestjs/common';

import { createPagination } from '../../../../../common/helpers/pagination.helper';

import { GetBattleLeaderBoardCommand } from './get-battle-leader-board.command';

import { UserQueryService } from '../../../../../modules/user/infrastructure/prisma/query/prisma-user-query.service';

@Injectable()
export class GetBattleLeaderboardUseCase {
  constructor(private readonly userQueryService: UserQueryService) {}

  async execute({ page, limit }: GetBattleLeaderBoardCommand) {
    const { data, total } = await this.userQueryService.getBattleLeaderboard({
      page,
      limit,
    });
    const pagination = createPagination({ page, limit, totalItems: total });
    return { users: data, pagination };
  }
}
