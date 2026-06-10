import { Injectable } from '@nestjs/common';

import { RedisService } from '../../../../core/redis/redis.service';
import {
  getOnlineUsersResponse,
  IPlayerRepository,
  SetOnlineData,
} from '../../domain/repositories/player/player.repository';

@Injectable()
export class RedisPlayerRepository implements IPlayerRepository {
  constructor(private readonly redis: RedisService) {}

  private safeParse<T>(value: string | null | undefined): T | null {
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
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
