import { Inject, Injectable } from '@nestjs/common';

import { PLAYER_REPOSITORY } from '../../../../battle/domain/repositories/player/player.repository.token';
import type { IPlayerRepository } from '../../../../battle/domain/repositories/player/player.repository';

// список онлайн гравців
@Injectable()
export class GetOnlineUsersUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepo: IPlayerRepository,
  ) {}

  async execute() {
    return this.playerRepo.getOnlineUsers();
  }
}
