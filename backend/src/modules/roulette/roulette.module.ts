import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '../../shared/infrastructure/database/database.module';

import { PrismaModule } from '../../core/prisma/prisma.module';

import { UserModule } from '../user/user.module';

import { FinanceModule } from '../finance/finance.module';

import { RouletteController } from './presentation/roulette.controller';

import { PlaceBetUseCase } from './application/use-cases/place-bet/place-bet.usecase';
import { CreateGameSessionUseCase } from './application/use-cases/create-game-session/create-game-session.usecase';
import { LeaveGameUseCase } from './application/use-cases/leave-game/leave-game.usecase';
import { GetHistoryGameUseCase } from './application/use-cases/get-history-game/get-history-game.usecase';
import { GetUserAllGameSessionsUseCase } from './application/use-cases/get-user-all-game-sessions/get-user-all-game-sessions.usecase';

import { PrismaGameSessionRepository } from './infrastructure/prisma/repositories/prisma-game-session.repository';
import { PrismaRouletteBetRepository } from './infrastructure/prisma/repositories/prisma-roulette-bet.repository';

import { ROULETTE_BET_REPOSITORY } from './domain/repositories/roulette-bet.repository.token';
import { GAME_SESSION_REPOSITORY } from './domain/repositories/game-session.repository.token';

import { RouletteEngine } from './domain/engine/roulette.engine';

@Module({
  imports: [
    PrismaModule,
    DatabaseModule,
    FinanceModule,
    forwardRef(() => UserModule),
  ],
  controllers: [RouletteController],
  providers: [
    CreateGameSessionUseCase,
    PlaceBetUseCase,
    RouletteEngine,
    GetHistoryGameUseCase,
    LeaveGameUseCase,
    GetUserAllGameSessionsUseCase,
    { provide: GAME_SESSION_REPOSITORY, useClass: PrismaGameSessionRepository },
    { provide: ROULETTE_BET_REPOSITORY, useClass: PrismaRouletteBetRepository },
  ],
  exports: [GAME_SESSION_REPOSITORY],
})
export class RouletteModule {}
