import { Injectable } from '@nestjs/common';

import { RedisService } from '../../../../../core/redis/redis.service';
import { SessionEntity } from '../../../domain/entities/session.entity';
import type {
  DeleteSessionData,
  ISessionRepository,
} from '../../../domain/repositories/session.repository';
import {
  buildSessionKey,
  buildUserSessionsKey,
} from '../../../../../common/helpers/session-key.helper';

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
    await this.redis.sadd(buildUserSessionsKey(userId), sessionId);
  }

  // Отримує всі сесії користувача
  async getUserSessions(userId: string): Promise<SessionEntity[]> {
    const indexKey = buildUserSessionsKey(userId);

    const sessionIds = await this.redis.smembers(indexKey); // отримує всі sessionId користувача

    if (!sessionIds.length) return [];

    const keys = sessionIds.map((id) => buildSessionKey(id));
    const sessionsRaw = await this.redis.mget(...keys);

    return sessionsRaw.reduce<SessionEntity[]>((acc, item) => {
      if (!item) return acc;

      const entity = this.toEntity(item);
      if (entity) acc.push(entity);

      return acc;
    }, []);
  }

  // Отримує одну сесію по ключу
  async getSession(sessionId: string): Promise<SessionEntity | null> {
    const sessionKey = buildSessionKey(sessionId);
    const data = await this.redis.get(sessionKey);
    if (!data) return null;
    return this.toEntity(data);
  }

  // Видаляє одну сесію (logout з одного пристрою)
  async deleteSession({ sessionId, userId }: DeleteSessionData): Promise<void> {
    const pipeline = this.redis.pipeline();

    const sessionKey = buildSessionKey(sessionId);

    // видаляємо саму сесію
    pipeline.del(sessionKey);

    // прибираємо sessionId з індексу користувача
    const indexKey = buildUserSessionsKey(userId);
    pipeline.srem(indexKey, sessionId);
    await pipeline.exec();
  }

  // Видаляє всі сесії користувача (logout з усіх пристроїв)
  async deleteAllUserSessions(userId: string): Promise<void> {
    const indexKey = buildUserSessionsKey(userId);

    // отримуємо всі sessionId користувача
    const sessionIds = await this.redis.smembers(indexKey); // отримує всі sessionId користувача
    const pipeline = this.redis.pipeline();

    // видаляємо всі session:* ключі
    if (sessionIds.length) {
      const sessionKeys = sessionIds.map((id) => buildSessionKey(id));
      pipeline.del(...sessionKeys);
    }

    // видаляємо індекс користувача
    pipeline.del(indexKey);
    await pipeline.exec();
  }
}
