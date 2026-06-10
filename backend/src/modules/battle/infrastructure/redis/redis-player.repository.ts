import { Injectable } from '@nestjs/common';

import { RedisService } from '../../../../core/redis/redis.service';
import {
  getOnlineUsersResponse,
  PlayerRepositoryInterface,
  SetOnlineData,
} from '../../domain/interfaces/player-repository.interface';

@Injectable()
export class RedisPlayerRepository implements PlayerRepositoryInterface {
  constructor(private readonly redis: RedisService) {}

  private safeParse<T>(value: string): T | null {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      return null;
    }
  }

  // user online
  async setOnline(data: SetOnlineData): Promise<void> {
    await this.redis.sadd('players:online', JSON.stringify(data));
  }

  // user offline
  async setOffline(userId: string): Promise<void> {
    const users = await this.redis.smembers('players:online');
    const userToRemove = users.find((user) => {
      const parsed = this.safeParse<SetOnlineData>(user);
      return parsed?.id === userId;
    });
    if (userToRemove) {
      await this.redis.srem('players:online', userToRemove);
    }
  }

  // список онлайн гравців
  async getOnlineUsers(): Promise<getOnlineUsersResponse[]> {
    const users = await this.redis.smembers('players:online');
    return users
      .map((u) => this.safeParse<getOnlineUsersResponse>(u))
      .filter((u): u is getOnlineUsersResponse => u !== null);
  }
}
