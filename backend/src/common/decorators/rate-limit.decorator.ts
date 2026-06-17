import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rate_limit_key';

export const RateLimit = (limit: number, ttl: number) =>
  SetMetadata(RATE_LIMIT_KEY, { limit, ttl });
