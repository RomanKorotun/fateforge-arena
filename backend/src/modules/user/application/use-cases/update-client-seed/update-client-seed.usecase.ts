import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UpdateClientSeedCommand } from './update-client-seed.command';

import { USER_SEED_REPOSITORY } from '../../../domain/repositories/user-seed.repository.token';
import type { IUserSeedRepository } from '../../../domain/repositories/user-seed.repository';

import { GAME_SESSION_REPOSITORY } from '../../../../roulette/domain/repositories/game-session.repository.token';
import type { IGameSessionRepository } from '../../../../roulette/domain/repositories/game-session.repository';

@Injectable()
export class UpdateClientSeedUseCase {
  constructor(
    @Inject(USER_SEED_REPOSITORY)
    private readonly userSeedRepository: IUserSeedRepository,

    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
  ) {}

  async execute({ userId, clientSeed }: UpdateClientSeedCommand) {
    const activeSession =
      await this.gameSessionRepository.findActiveByUserId(userId);

    if (activeSession) {
      throw new BadRequestException(
        'Неможливо змінити client seed під час активної ігрової сесії',
      );
    }

    const userSeed = await this.userSeedRepository.upsertSeed({
      userId,
      clientSeed,
    });

    return userSeed;
  }
}
