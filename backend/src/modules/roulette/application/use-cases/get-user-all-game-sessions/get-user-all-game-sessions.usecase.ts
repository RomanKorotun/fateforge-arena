import { Inject, Injectable } from '@nestjs/common';

import type { IGameSessionRepository } from '../../../domain/repositories/game-session.repository';
import { GAME_SESSION_REPOSITORY } from '../../../../roulette/domain/repositories/game-session.repository.token';

@Injectable()
export class GetUserAllGameSessionsUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly repo: IGameSessionRepository,
  ) {}

  async execute(userId: string) {
    const sessions = await this.repo.findAllByUserId(userId);

    return sessions.map((s) => ({
      id: s.id,
      clientSeed: s.clientSeed,
      nonce: s.nonce,
      isActive: s.isActive,
      createdAt: s.createdAt,
    }));
  }
}
