import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import crypto from 'crypto';

import { USER_SEED_REPOSITORY } from '../../../../user/domain/repositories/user-seed.repository.token';
import type { IUserSeedRepository } from '../../../../user/domain/repositories/user-seed.repository';

import type { IGameSessionRepository } from '../../../domain/repositories/game-session.repository';
import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session.repository.token';

@Injectable()
export class CreateGameSessionUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
    @Inject(USER_SEED_REPOSITORY)
    private readonly userSeedRepo: IUserSeedRepository
  ) {}

  async execute(userId: string) {
    const seedEntity = await this.userSeedRepo.getSeed(userId);

    if (!seedEntity) {
      throw new NotFoundException('clientSeed не знайдено');
    }

    const serverSeed = crypto.randomBytes(32).toString('hex');

    const serverHash = crypto
      .createHash('sha256')
      .update(serverSeed)
      .digest('hex');
    
    const clientSeed = seedEntity.clientSeed;

    const gameSession = await this.gameSessionRepository.create({
      userId,
      serverSeed,
      serverHash,
      clientSeed,
    });

    return gameSession;
  }
}
