import { Inject, Injectable } from '@nestjs/common';

import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session/game-session.repository.token';
import type { IGameSessionRepository } from '../../../domain/repositories/game-session/game-session.repository';

@Injectable()
export class GetCurrentGameUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
  ) {}
  async execute(userId: string) {
    const activeSession = await this.gameSessionRepository.get(userId);
    return activeSession
      ? { gameId: activeSession.gameId, walletId: activeSession.walletId }
      : null;
  }
}
