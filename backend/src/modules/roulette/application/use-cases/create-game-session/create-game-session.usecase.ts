import { Inject, Injectable } from '@nestjs/common';
import crypto from 'crypto';

import type { IGameSessionRepository } from '../../../domain/repositories/game-session.repository';
import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session.repository.token';

@Injectable()
export class CreateGameSessionUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepo: IGameSessionRepository,
  ) {}

  async execute(userId: string) {
    const serverSeed = crypto.randomBytes(32).toString('hex');

    const serverHash = crypto
      .createHash('sha256')
      .update(serverSeed)
      .digest('hex');

    const clientSeed = crypto.randomUUID();

    const session = await this.gameSessionRepo.create({
      userId,
      serverSeed,
      serverHash,
      clientSeed,
    });

    return {
      sessionId: session.id,
      serverHash: session.serverHash,
      clientSeed: session.clientSeed,
    };
  }
}
