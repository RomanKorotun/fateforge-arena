import { Module } from '@nestjs/common';

import { RateLimitModule } from '../../shared/infrastructure/rate-limit/rate-limit.module';

import { RedisModule } from '../../core/redis/redis.module';

import { ChatGateway } from './presentation/chat.gateway';
import { ChatRedisRepository } from './infrastructure/redis/chat.repository';

import { JoinRoomUseCase } from './application/use-cases/join-room.usecase';
import { LeaveRoomUseCase } from './application/use-cases/leave-room.usecase';
import { SendMessageUseCase } from './application/use-cases/send-message.usecase';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RedisModule, AuthModule, RateLimitModule],
  providers: [
    ChatGateway,
    ChatRedisRepository,
    SendMessageUseCase,
    JoinRoomUseCase,
    LeaveRoomUseCase,
  ],
})
export class ChatModule {}
