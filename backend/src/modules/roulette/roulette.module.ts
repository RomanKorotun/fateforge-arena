import { Module } from '@nestjs/common';

import { RouletteController } from './presentation/roulette.controller';
import { CreateGameSessionUseCase } from './application/use-cases/create-game-session/create-game-session.usecase';
import { GAME_SESSION_REPOSITORY } from './domain/repositories/game-session.repository.token';
import { PrismaGameSessionRepository } from './infrastructure/prisma/repositories/prisma-game-session.repository';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { PlaceBetUseCase } from './application/use-cases/place-bet/place-bet.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [RouletteController],
  providers: [
    CreateGameSessionUseCase,
    PlaceBetUseCase,
    { provide: GAME_SESSION_REPOSITORY, useClass: PrismaGameSessionRepository },
  ],
})
export class RouletteModule {}
