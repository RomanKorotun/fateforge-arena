import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

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
    private readonly rouletteBetRepository: IRouletteBetRepository,

    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
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

    let finalUserId: string | undefined;

    if (!isAdmin) {
      if (userId && userId !== requesterId) {
        throw new ForbiddenException(
          'Заборонено фільтрувати дані іншого користувача',
        );
      }

      finalUserId = requesterId;

      if (gameSessionId) {
        const session =
          await this.gameSessionRepository.findById(gameSessionId);

        if (!session || session.userId !== requesterId) {
          throw new ForbiddenException('Немає доступу до цієї ігрової сесії');
        }
      }
    } else {
      finalUserId = userId;
    }

    const result = await this.rouletteBetRepository.findMany({
      userId: finalUserId,
      gameSessionId,
      betType,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      page,
      limit,
    });

    return {
      data: result.data,
      pagination: {
        page,
        totalItems: result.total,
        totalPages: Math.max(1, Math.ceil(result.total / limit)),
        hasNextPage: page * limit < result.total,
        hasPrevPage: page > 1,
      },
    };
  }
}
