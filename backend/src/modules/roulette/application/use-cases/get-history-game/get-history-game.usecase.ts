import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { createPagination } from '../../../../../common/helpers/pagination.helper';
import { UserRole } from '../../../../user/domain/enums/user-role.enum';
import { ROULETTE_BET_REPOSITORY } from '../../../domain/repositories/roulette-bet.repository.token';
import type { IRouletteBetRepository } from '../../../domain/repositories/roulette-bet.repository';
import type { IGameSessionRepository } from '../../../domain/repositories/game-session.repository';
import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session.repository.token';
import { GetHistoryGameCommand } from './get-history-game.command';

@Injectable()
export class GetHistoryGameUseCase {
  constructor(
    @Inject(ROULETTE_BET_REPOSITORY)
    private readonly rouletteBetRepo: IRouletteBetRepository,
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepo: IGameSessionRepository,
  ) {}

  async execute(command: GetHistoryGameCommand) {
    const {
      requesterId,
      requesterRole,
      userId,
      gameSessionId,
      betType,
      from,
      to,
      page,
      limit,
    } = command;

    const isAdmin = requesterRole === UserRole.ADMIN;

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    let finalUserId: string | undefined;

    if (!isAdmin) {
      if (userId && userId !== requesterId) {
        throw new ForbiddenException(
          'Заборонено фільтрувати дані іншого користувача',
        );
      }

      finalUserId = requesterId;

      if (gameSessionId) {
        const session = await this.gameSessionRepo.findById(gameSessionId);

        if (!session || session.userId !== requesterId) {
          throw new ForbiddenException('Немає доступу до цієї ігрової сесії');
        }
      }
    } else {
      finalUserId = userId;
    }

    const { data, total } = await this.rouletteBetRepo.findMany({
      userId: finalUserId,
      gameSessionId,
      betType,
      from: fromDate,
      to: toDate,
      page,
      limit,
    });

    const pagination = createPagination({ page, limit, totalItems: total });

    return { bets: data, pagination };
  }
}
