import { Injectable } from '@nestjs/common';

import { BattleRoom } from '../../domain/entities/battle-room.entity';
import { RedisService } from '../../../../core/redis/redis.service';
import { IBattleRepository } from '../../domain/repositories/battle/battle.repository';

@Injectable()
export class RedisBattleRepository implements IBattleRepository {
  constructor(private readonly redis: RedisService) {}

  private safeParse<T>(value: string | null): T | null {
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  // зберегти стан бою
  async save(room: BattleRoom): Promise<void> {
    await this.redis.set(`battle:${room.id}`, JSON.stringify(room));
  }

  // отримати бій
  async get(roomId: string): Promise<BattleRoom | null> {
    const data = await this.redis.get(`battle:${roomId}`);
    return this.safeParse<BattleRoom>(data);
  }

  // видалити бій
  async delete(roomId: string): Promise<void> {
    await this.redis.del(`battle:${roomId}`);
  }

  // отримати всі активні сесії
  async getAllActive(): Promise<BattleRoom[]> {
    const keys = await this.redis.keys('battle:*');
    const battles = await Promise.all(keys.map((k) => this.redis.get(k)));
    return battles
      .map((b) => this.safeParse<BattleRoom>(b))
      .filter((b): b is BattleRoom => b !== null);
  }
}
