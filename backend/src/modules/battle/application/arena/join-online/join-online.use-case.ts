import { Inject, Injectable } from '@nestjs/common';

import { JoinOnlineCommand } from './join-online.command';
import { PLAYER_REPOSITORY } from '../../../../battle/domain/repositories/player/player.repository.token';
import type { IPlayerRepository } from '../../../../battle/domain/repositories/player/player.repository';

// користувач заходить в гру → стає online
@Injectable()
export class JoinOnlineUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepo: IPlayerRepository,
  ) {}

  async execute(command: JoinOnlineCommand): Promise<void> {
    await this.playerRepo.setOnline(command);
  }
}
