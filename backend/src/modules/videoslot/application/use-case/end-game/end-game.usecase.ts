import {
  Injectable,
  NotFoundException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';

import type { IVideoslotHistoryRepository } from '../../../domain/repositories/videoslot-history/videosllot-history.repository';
import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session/game-session.repository.token';
import type { IGameSessionRepository } from '../../../domain/repositories/game-session/game-session.repository';
import { VIDEOSLOT_HISTORY_REPOSITORY } from '../../../domain/repositories/videoslot-history/videosllot-history.repository.token';

@Injectable()
export class EndGameUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
    @Inject(VIDEOSLOT_HISTORY_REPOSITORY)
    private readonly historyRepo: IVideoslotHistoryRepository,
  ) {}

  async execute(userId: string, gameId: string) {
    const session = await this.gameSessionRepository.get(userId);

    if (!session) {
      throw new NotFoundException('Ігрову сесію не знайдено');
    }

    if (session.gameId !== gameId) {
      throw new ForbiddenException('Ця сесія належить іншій грі');
    }

    await this.gameSessionRepository.delete(userId);

    const rtp =
      session.totalBets > 0
        ? Number(((session.totalWins / session.totalBets) * 100).toFixed(2))
        : 0;

    const history = await this.historyRepo.create({
      userId,
      gameId: session.gameId,
      currency: session.currency,
      mode: session.mode,
      totalSpins: session.totalSpins,
      totalBets: session.totalBets,
      totalWins: session.totalWins,
      rtp,
    });

    return {
      message: 'Game session ended successfully',
      stats: history,
    };
  }
}
