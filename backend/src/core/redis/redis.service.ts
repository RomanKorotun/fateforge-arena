import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  constructor(config: ConfigService) {
    const url = config.getOrThrow<string>('REDIS_URL_AUTH');

    // super(url);
    super(url);

    this.on('connect', () => this.logger.log('Redis connected'));
    this.on('error', (err) =>
      this.logger.error(`Redis error: ${err.message}`, err.stack),
    );
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
