import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(config: ConfigService) {
    const url = config.getOrThrow<string>('REDIS_URL_AUTH');

    super(url);

    this.on('connect', () => console.log('Redis connected'));
    this.on('error', (err) => console.error('Redis error', err.message));
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
