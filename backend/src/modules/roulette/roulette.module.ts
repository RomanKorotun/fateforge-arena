import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/prisma/prisma.module';

import { RouletteController } from './presentation/roulette.controller';

import { PlaceBetUseCase } from './application/use-cases/place-bet/place-bet.usecase';
import { CreateGameSessionUseCase } from './application/use-cases/create-game-session/create-game-session.usecase';
import { LeaveGameUseCase } from './application/use-cases/leave-game/leave-game.usecase';
import { GetHistoryGameUseCase } from './application/use-cases/get-history-game/get-history-game.usecase';

import { PrismaGameSessionRepository } from './infrastructure/prisma/repositories/prisma-game-session.repository';
import { PrismaRouletteBetRepository } from './infrastructure/prisma/repositories/prisma-roulette-bet.repository';

import { ROULETTE_BET_REPOSITORY } from './domain/repositories/roulette-bet.repository.token';
import { GAME_SESSION_REPOSITORY } from './domain/repositories/game-session.repository.token';

import { RouletteEngine } from './domain/engine/roulette.engine';

@Module({
  imports: [PrismaModule],
  controllers: [RouletteController],
  providers: [
    CreateGameSessionUseCase,
    PlaceBetUseCase,
    RouletteEngine,
    GetHistoryGameUseCase,
    LeaveGameUseCase,
    { provide: GAME_SESSION_REPOSITORY, useClass: PrismaGameSessionRepository },
    { provide: ROULETTE_BET_REPOSITORY, useClass: PrismaRouletteBetRepository },
  ],
})
export class RouletteModule {}
