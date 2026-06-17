import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Reflector } from '@nestjs/core';

import { RateLimitService } from '../../shared/infrastructure/rate-limit/rate-limit.service';
import { RATE_LIMIT_KEY } from '../decorators/rate-limit.decorator';

@Injectable()
export class WsRateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimitService: RateLimitService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const handler = context.getHandler();
    const gateway = context.getClass().name;

    const config = this.reflector.get(RATE_LIMIT_KEY, handler);

    // якщо нема декоратора → дефолтний захист
    const limit = config?.limit ?? 100;
    const ttl = config?.ttl ?? 60;

    const user = client.data.user;

    const key = `ratelimit:ws:${user.id}:${gateway}:${handler.name}`;

    const allowed = await this.rateLimitService.check(key, limit, ttl);

    if (!allowed) {
      throw new WsException('Too many requests');
    }

    return true;
  }
}
