import { Injectable } from '@nestjs/common';

import { ChatRedisRepository } from '../../infrastructure/redis/chat.repository';

import { ChatUser } from '../../domain/interfaces/chat-user.interface';
import { ChatMessage } from '../../domain/interfaces/chat-message.interface';

@Injectable()
export class SendMessageUseCase {
  constructor(private readonly repo: ChatRedisRepository) {}

  async execute(user: ChatUser, room: string, content: string) {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: user.id,
      username: user.username,
      room,
      content,
      createdAt: new Date().toISOString(),
    };

    await this.repo.saveMessage(message);
    return message;
  }
}
