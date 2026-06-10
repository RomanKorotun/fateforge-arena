import { Injectable } from '@nestjs/common';

import { RedisPlayerRepository } from '../../../infrastructure/redis/redis-player.repository';

// список онлайн гравців
@Injectable()
export class GetOnlineUsersUseCase {
  constructor(private readonly playerRepo: RedisPlayerRepository) {}

  async execute() {
    return this.playerRepo.getOnlineUsers();
  }
}
