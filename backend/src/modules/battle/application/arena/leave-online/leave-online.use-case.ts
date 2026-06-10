import { Inject, Injectable } from '@nestjs/common';

import { PLAYER_REPOSITORY } from '../../../../battle/domain/repositories/player/player.repository.token';
import type { IPlayerRepository } from '../../../../battle/domain/repositories/player/player.repository';

// користувач виходить → offline
@Injectable()
export class LeaveOnlineUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepo: IPlayerRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.playerRepo.setOffline(userId);
  }
}
