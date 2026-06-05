import { Injectable } from '@nestjs/common';

import { ChatRedisRepository } from '../../infrastructure/redis/chat.repository';

import { ChatUser } from '../../domain/interfaces/chat-user.interface';

@Injectable()
export class JoinRoomUseCase {
  constructor(private readonly repo: ChatRedisRepository) {}

  async execute(room: string, user: ChatUser) {
    await this.repo.addUser(room, user);
  }
}
