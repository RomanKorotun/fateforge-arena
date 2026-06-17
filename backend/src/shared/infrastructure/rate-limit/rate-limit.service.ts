import { Injectable } from '@nestjs/common';

import { RedisService } from '../../../core/redis/redis.service';

@Injectable()
export class RateLimitService {
  constructor(private readonly redis: RedisService) {}

  async check(
    key: string,
    limit: number,
    ttlSeconds: number,
  ): Promise<boolean> {
    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, ttlSeconds);
    }

    return count <= limit;
  }
}
