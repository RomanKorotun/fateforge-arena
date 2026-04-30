import { Injectable } from '@nestjs/common';

import { RedisService } from '../../../../../core/redis/redis.service';
import { SessionEntity } from '../../../domain/entities/session.entity';
import type {
  DeleteSessionData,
  ISessionRepository,
} from '../../../domain/repositories/session.repository';

@Injectable()
export class RedisSessionRepository implements ISessionRepository {
  constructor(private readonly redis: RedisService) {}

  // Перетворює JSON з Redis у SessionEntity
  private toEntity(raw: string): SessionEntity | null {
    try {
      return JSON.parse(raw) as SessionEntity;
    } catch {
      return null;
    }
  }

  // Створює або оновлює сесію
  // EX = TTL (час життя сесії в Redis)
  async set(
    key: string,
    value: SessionEntity,
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  // Додає sessionId в Set користувача
  // Це індекс для швидкого пошуку всіх сесій юзера
  async addSessionIndex(userId: string, sessionId: string): Promise<void> {
    await this.redis.sadd(`userSessions:${userId}`, sessionId);
  }

  // Отримує всі sessionId користувача
  // Set гарантує унікальність сесій
  async getUserSessionIds(userId: string): Promise<string[]> {
    return this.redis.smembers(`userSessions:${userId}`);
  }

  // Отримує всі сесії користувача
  async getUserSessions(userId: string): Promise<SessionEntity[]> {
    const sessionIds = await this.getUserSessionIds(userId);

    // якщо сесій нема — повертаємо пустий масив
    if (!sessionIds.length) return [];

    const keys = sessionIds.map((id) => `session:${id}`);

    // mget = один запит в Redis замість N окремих запитів
    const sessionsRaw = await this.redis.mget(...keys);

    return sessionsRaw
      .filter((v): v is string => Boolean(v)) // прибираємо null
      .map((v) => this.toEntity(v)) // JSON → entity
      .filter((v): v is SessionEntity => v !== null); // прибираємо биті дані
  }

  // Отримує одну сесію по ключу
  async getSession(sessionKey: string): Promise<SessionEntity | null> {
    const data = await this.redis.get(sessionKey);
    if (!data) return null;
    return this.toEntity(data);
  }

  // Видаляє одну сесію (logout з одного пристрою)
  async deleteSession({ sessionId, userId }: DeleteSessionData): Promise<void> {
    const pipeline = this.redis.pipeline();

    // видаляємо саму сесію
    pipeline.del(`session:${sessionId}`);

    // прибираємо sessionId з індексу користувача
    pipeline.srem(`userSessions:${userId}`, sessionId);
    await pipeline.exec();
  }

  // Видаляє всі сесії користувача (logout з усіх пристроїв)
  async deleteAllUserSessions(userId: string): Promise<void> {
    const indexKey = `userSessions:${userId}`;

    // отримуємо всі sessionId користувача
    const sessionIds = await this.redis.smembers(indexKey);
    const pipeline = this.redis.pipeline();

    // видаляємо всі session:* ключі
    if (sessionIds.length) {
      const sessionKeys = sessionIds.map((id) => `session:${id}`);
      pipeline.del(...sessionKeys);
    }

    // видаляємо індекс користувача
    pipeline.del(indexKey);
    await pipeline.exec();
  }
}
