import { Injectable } from '@nestjs/common';

import { RedisService } from '../../../../core/redis/redis.service';
import { GameSession } from '../../domain/entities/game-session.entity';
import { IGameSessionRepository } from '../../domain/repositories/game-session/game-session.repository';

@Injectable()
export class RedisGameSessionRepository implements IGameSessionRepository {
  constructor(private readonly redis: RedisService) {}

  private getKey(userId: string) {
    return `slot_session:${userId}`;
  }

  private toEntity(raw: string): GameSession | null {
    try {
      const parsed: GameSession = JSON.parse(raw);
      return parsed;
    } catch {
      return null;
    }
  }

  async save(userId: string, session: GameSession): Promise<void> {
    await this.redis.set(this.getKey(userId), JSON.stringify(session));
  }

  async get(userId: string): Promise<GameSession | null> {
    const data = await this.redis.get(this.getKey(userId));
    if (!data) return null;
    return this.toEntity(data);
  }

  async delete(userId: string): Promise<void> {
    await this.redis.del(this.getKey(userId));
  }
}
