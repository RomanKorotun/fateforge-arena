import { Module } from '@nestjs/common';

import { RedisModule } from '../../core/redis/redis.module';
import { PrismaModule } from '../../core/prisma/prisma.module';

import { FinanceModule } from '../finance/finance.module';

import { VideoslotController } from './presentation/controllers/videoslot.controller';

import { CreateGameUseCase } from './application/use-case/create-game/create-game.ussecase';
import { PlaySpinUseCase } from './application/use-case/play-spin/play-spin.usecase';
import { ReelGeneratorService } from './application/services/reel-generator.service';
import { GetCurrentGameUseCase } from './application/use-case/get-current-videoslot-session/get-current-game.usecase';
import { EndGameUseCase } from './application/use-case/end-game/end-game.usecase';
import { GetVideoslotHistoryUseCase } from './application/use-case/get-videoslot-history/get-videoslot-history.usecase';

import { PrismaVideoslotistoryRepository } from './infrastructure/prisma/prisma-videoslot-history.repository';
import { RedisGameSessionRepository } from './infrastructure/redis/redis-game-session.repository';
import { DatabaseModule } from '../../shared/infrastructure/database/database.module';

import { GAME_SESSION_REPOSITORY } from './domain/repositories/game-session/game-session.repository.token';
import { VIDEOSLOT_HISTORY_REPOSITORY } from './domain/repositories/videoslot-history/videosllot-history.repository.token';

@Module({
  imports: [FinanceModule, RedisModule, PrismaModule, DatabaseModule],
  controllers: [VideoslotController],
  providers: [
    CreateGameUseCase,
    PlaySpinUseCase,
    ReelGeneratorService,
    EndGameUseCase,
    GetCurrentGameUseCase,
    GetVideoslotHistoryUseCase,
    {
      provide: VIDEOSLOT_HISTORY_REPOSITORY,
      useClass: PrismaVideoslotistoryRepository,
    },
    {
      provide: GAME_SESSION_REPOSITORY,
      useClass: RedisGameSessionRepository,
    },
  ],
})
export class VideoslotModule {}
