import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RateLimitService } from '../../shared/infrastructure/rate-limit/rate-limit.service';
import { RATE_LIMIT_KEY } from '../decorators/rate-limit.decorator';

@Injectable()
export class HttpRateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimitService: RateLimitService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const handler = context.getHandler();
    const controller = context.getClass().name;

    const config = this.reflector.get(
      RATE_LIMIT_KEY,
      handler,
    );

    const limit = config?.limit ?? 100;
    const ttl = config?.ttl ?? 60;

   const key = `ratelimit:http:${request.ip}:${controller}:${handler.name}`;

    const allowed = await this.rateLimitService.check(
      key,
      limit,
      ttl,
    );

    if (!allowed) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}