import { Module } from '@nestjs/common';

import { VideoslotController } from './presentation/videoslot.controller';
import { CreateGameUseCase } from './application/create-game/create-game.ussecase';
import { PlaySpinUseCase } from './application/play-spin/play-spin.usecase';
import { FinanceModule } from '../finance/finance.module';
import { ReelGeneratorService } from './application/services/reel-generator.service';
import { EndGameUseCase } from './application/end-game/end-game.usecase';
import { PrismaVideoslotistoryRepository } from './infrastructure/prisma/prisma-videoslot-history.repository';
import { RedisModule } from '../../core/redis/redis.module';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [FinanceModule, RedisModule, PrismaModule, DatabaseModule],
  controllers: [VideoslotController],
  providers: [
    CreateGameUseCase,
    PlaySpinUseCase,
    ReelGeneratorService,
    EndGameUseCase,
    {provide: "IVideoslotHistoryRepository", useClass: PrismaVideoslotistoryRepository}
  ],
})
export class VideoslotModule {}
