import { Injectable } from '@nestjs/common';

import { BattleRoom } from '../../domain/entities/battle-room.entity';
import { RedisService } from '../../../../core/redis/redis.service';
import { BattleRepositoryInterface } from '../../domain/interfaces/battle-repository.interface';

@Injectable()
export class RedisBattleRepository implements BattleRepositoryInterface {
  constructor(private readonly redis: RedisService) {}

  // зберегти стан бою
  async save(room: BattleRoom): Promise<void> {
    await this.redis.set(`battle:${room.id}`, JSON.stringify(room));
  }

  // отримати бій
  async get(roomId: string): Promise<BattleRoom | null> {
    const data = await this.redis.get(`battle:${roomId}`);
    return data ? JSON.parse(data) : null;
  }

  // видалити бій
  async delete(roomId: string): Promise<void> {
    await this.redis.del(`battle:${roomId}`);
  }

  // отримати всі активні сесії
  async getAllActive(): Promise<BattleRoom[]> {
    const keys = await this.redis.keys('battle:*');
    const battles = await Promise.all(keys.map((k) => this.redis.get(k)));
    return battles.filter(Boolean).map((b) => JSON.parse(b!));
  }
}
