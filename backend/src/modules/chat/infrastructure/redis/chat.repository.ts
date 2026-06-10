import { Injectable } from '@nestjs/common';

import { RedisService } from '../../../../core/redis/redis.service';

import { ChatUser } from '../../domain/interfaces/chat-user.interface';
import { ChatMessage } from '../../domain/interfaces/chat-message.interface';

@Injectable()
export class ChatRedisRepository {
  constructor(private readonly redis: RedisService) {}

  // Ключ для зберігання користувачів кімнати
  private usersKey(room: string) {
    return `room:${room}:users`;
  }

  // Ключ для зберігання повідомлень кімнати
  private messagesKey(room: string) {
    return `room:${room}:messages`;
  }

  private safeParse<T>(value: string): T | null {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('JSON parse error:', error);
      return null;
    }
  }

  // Додаємо користувача в кімнату
  async addUser(room: string, user: ChatUser) {
    // Отримуємо ключ кімнати
    const key = this.usersKey(room);

    // Додаємо нового користувача
    await this.redis.sadd(key, JSON.stringify(user));
  }

  // Видаляємо користувача з кімнати
  async removeUser(room: string, userId: string) {
    // Отримуємо ключ кімнати
    const key = this.usersKey(room);

    // Отримуємо всіх користувачів кімнати
    const users = await this.redis.smembers(key);

    // Перебираємо всіх користувачів
    for (const raw of users) {
      // Парсимо JSON
      const parsedUser = this.safeParse<ChatUser>(raw);

      // Якщо запис битий — пропускаємо
      if (!parsedUser) continue;

      // Якщо знайшли потрібного користувача
      if (parsedUser.id === userId) {
        // Видаляємо його
        await this.redis.srem(key, raw);

        // Припиняємо цикл
        break;
      }
    }
  }

  // Отримуємо всіх користувачів кімнати
  async getUsers(room: string) {
    // Отримуємо ключ кімнати
    const key = this.usersKey(room);

    // Отримуємо всіх користувачів кімнати
    const users = await this.redis.smembers(key);

    // Парсимо всі записи
    return users
      .map((raw) => this.safeParse<ChatUser>(raw))
      .filter((user) => user !== null);
  }

  // зберігаємо повідомлення
  async saveMessage(message: ChatMessage) {
    // Формуємо ключ кімнати
    const key = this.messagesKey(message.room);

    // Додаємо повідомлення на початок списку
    await this.redis.lpush(key, JSON.stringify(message));

    // Залишаємо лише останні 50 повідомлень
    await this.redis.ltrim(key, 0, 49);
  }

  // Отримуємо останні повідомлення кімнати
  async getLastMessages(room: string) {
    // Формуємо ключ кімнати
    const key = this.messagesKey(room);

    // Отримуємо повідомлення
    const msgs = await this.redis.lrange(key, 0, -1);

    // Парсимо повідомленн
    return msgs
      .map((raw) => this.safeParse<ChatMessage>(raw))
      .filter((message) => message !== null)
      .reverse();
  }
}
