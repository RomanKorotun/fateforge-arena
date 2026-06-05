import { Injectable } from '@nestjs/common';

import { ChatRedisRepository } from '../../infrastructure/redis/chat.repository';

@Injectable()
export class LeaveRoomUseCase {
  constructor(private readonly repo: ChatRedisRepository) {}

  async execute(room: string, userId: string) {
    await this.repo.removeUser(room, userId);
  }
}
