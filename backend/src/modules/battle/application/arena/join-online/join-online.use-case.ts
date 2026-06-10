import { Injectable } from '@nestjs/common';

import { RedisPlayerRepository } from '../../../infrastructure/redis/redis-player.repository';
import { JoinOnlineCommand } from './join-online.command';

// користувач заходить в гру → стає online
@Injectable()
export class JoinOnlineUseCase {
  constructor(private readonly playerRepo: RedisPlayerRepository) {}

  async execute(command: JoinOnlineCommand): Promise<void> {
    await this.playerRepo.setOnline(command);
  }
}
