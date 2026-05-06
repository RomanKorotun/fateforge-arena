import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import crypto from 'crypto';

import type { IGameSessionRepository } from '../../../domain/repositories/game-session.repository';
import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session.repository.token';

@Injectable()
export class CreateGameSessionUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
  ) {}

  async execute(userId: string) {
    const clientSeed = crypto.randomUUID();

    if (!clientSeed) {
      throw new NotFoundException('clientSeed не знайдено');
    }

    const serverSeed = crypto.randomBytes(32).toString('hex');

    const serverHash = crypto
      .createHash('sha256')
      .update(serverSeed)
      .digest('hex');

    const gameSession = await this.gameSessionRepository.create({
      userId,
      serverSeed,
      serverHash,
      clientSeed,
    });

    return gameSession;
  }
}
