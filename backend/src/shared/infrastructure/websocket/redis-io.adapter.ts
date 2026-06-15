import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

import { RedisService } from '../../../core/redis/redis.service';

export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);
  private adapter!: ReturnType<typeof createAdapter>;

  private pubClient!: Redis;
  private subClient!: Redis;

  constructor(
    app: INestApplicationContext,
    private readonly redisService: RedisService,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    this.pubClient = this.redisService;
    this.subClient = this.redisService.duplicate();

    this.pubClient.on('error', (err) => {
      this.logger.error(`Redis PUB error: ${err.message}`, err.stack);
    });

    this.subClient.on('error', (err) => {
      this.logger.error(`Redis SUB error: ${err.message}`, err.stack);
    });

    this.adapter = createAdapter(this.pubClient, this.subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapter);
    return server;
  }
}
