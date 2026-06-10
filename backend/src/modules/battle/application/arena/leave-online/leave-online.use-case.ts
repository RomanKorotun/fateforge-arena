import { Injectable } from '@nestjs/common';

import { RedisPlayerRepository } from '../../../infrastructure/redis/redis-player.repository';

// користувач виходить → offline
@Injectable()
export class LeaveOnlineUseCase {
  constructor(private readonly playerRepo: RedisPlayerRepository) {}

  async execute(userId: string): Promise<void> {
    await this.playerRepo.setOffline(userId);
  }
}
