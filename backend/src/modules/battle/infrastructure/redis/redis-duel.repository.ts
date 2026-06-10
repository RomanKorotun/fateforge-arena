import { Injectable } from '@nestjs/common';

import { DuelRequest } from '../../domain/entities/duel-request.entity';
import { IDuelRepository } from '../../domain/repositories/duel/duel.repository';
import { RedisService } from '../../../../core/redis/redis.service';

@Injectable()
export class RedisDuelRepository implements IDuelRepository {
  constructor(private readonly redis: RedisService) {}

  private safeParse<T>(value: string | null): T | null {
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      return null;
    }
  }

  // зберегти заявку на дуель
  async save(duel: DuelRequest): Promise<void> {
    await this.redis.set(`duel:${duel.id}`, JSON.stringify(duel)); // зберігаємо сам обʼєкт дуелі
    await this.redis.sadd('duel:pending', duel.id); // додаємо в список "всі активні заявки"
    await this.redis.set(`duel:user:${duel.challengerId}`, duel.id); // індекс: користувач → його активна дуель
  }

  // отримати заявку по challengerId
  async getByChallengerId(challengerId: string): Promise<DuelRequest | null> {
    const duelId = await this.redis.get(`duel:user:${challengerId}`);
    if (!duelId) return null;
    const duel = await this.redis.get(`duel:${duelId}`);
    return duel ? this.safeParse<DuelRequest>(duel) : null;
  }

  // отримати дуель по айді отримати по id
  async get(id: string): Promise<DuelRequest | null> {
    const data = await this.redis.get(`duel:${id}`);
    return this.safeParse<DuelRequest>(data);
  }

  // видалити заявку
  async delete(duel: DuelRequest): Promise<void> {
    await this.redis.del(`duel:${duel.id}`);
    await this.redis.srem('duel:pending', duel.id);
    await this.redis.del(`duel:user:${duel.challengerId}`);
  }

  // отримувати всі очікуючі дуелі
  async getPending(): Promise<DuelRequest[]> {
    const ids = await this.redis.smembers('duel:pending');
    const data = await Promise.all(
      ids.map((id) => this.redis.get(`duel:${id}`)),
    );
    return data
      .map((item) => this.safeParse<DuelRequest>(item))
      .filter((item): item is DuelRequest => item !== null);
  }
}
