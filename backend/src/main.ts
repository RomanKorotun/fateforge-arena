import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

import { AppModule } from './app.module';

import { swaggerConfig } from './core/config/runtime/swagger.config';
import { corsConfig } from './core/config/runtime/cors.config';
import { RedisService } from './core/redis/redis.service';

import { AllExceptionFilter } from './common/filters/all-exception.filter';

import { RedisIoAdapter } from './shared/infrastructure/websocket/redis-io.adapter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const redisService = app.get(RedisService);
  const redisAdapter = new RedisIoAdapter(app, redisService);
  await redisAdapter.connectToRedis();
  app.useWebSocketAdapter(redisAdapter);

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
  app.use(express.json());

  const config = app.get(ConfigService);

  app.enableCors(corsConfig);

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  const PORT = parseInt(config.getOrThrow('PORT'), 10);

  await app.listen(PORT, () => logger.log(`Server is running on ${PORT} PORT`));
}
void bootstrap();
