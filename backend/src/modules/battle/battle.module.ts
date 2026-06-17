import { Module } from '@nestjs/common';

import { RateLimitModule } from '../../shared/infrastructure/rate-limit/rate-limit.module';

import { RedisModule } from '../../core/redis/redis.module';
import { PrismaModule } from '../../core/prisma/prisma.module';

import { AuthModule } from '../auth/auth.module';

import { UserModule } from '../user/user.module';

import { JoinOnlineUseCase } from './application/arena/join-online/join-online.use-case';
import { LeaveOnlineUseCase } from './application/arena/leave-online/leave-online.use-case';
import { CreateDuelUseCase } from './application/duel/create-duel.use-case';
import { AcceptDuelUseCase } from './application/duel/accept-duel.use-case';
import { GetPendingDuelsUseCase } from './application/duel/get-pending-duels.use-case';
import { MakeMoveUseCase } from './application/battle/make-move.use-case';
import { GetMyActiveBattleUseCase } from './application/battle/get-my-active-battle.use-case';
import { FinishBattleUseCase } from './application/battle/finish-battle.use-case';
import { BattleTickService } from './application/services/battle-tick.service';
import { GetOnlineUsersUseCase } from './application/arena/get-online-users/get-online-users.use-case';
import { GetActiveBattlesUseCase } from './application/battle/get-active-battles.usecase';

import { RedisBattleRepository } from './infrastructure/redis/redis-battle.repository';
import { RedisDuelRepository } from './infrastructure/redis/redis-duel.repository';
import { PrismaBattleResultRepository } from './infrastructure/prisma/battle-result.repository';
import { RedisPlayerRepository } from './infrastructure/redis/redis-player.repository';

import { BattleGateway } from './presentation/battle.gateway';

import { BattleEngine } from './domain/services/battle-engine';
import { BATTLE_RESULT_REPOSITORY } from './domain/repositories/battle-result/battle-result.repository.token';
import { BATTLE_REPOSITORY } from './domain/repositories/battle/battle.repository.token';
import { DUEL_REPOSITORY } from './domain/repositories/duel/duel.repository.token';
import { PLAYER_REPOSITORY } from './domain/repositories/player/player.repository.token';

@Module({
  imports: [RedisModule, PrismaModule, AuthModule, UserModule, RateLimitModule],
  providers: [
    BattleGateway,
    BattleEngine,
    JoinOnlineUseCase,
    GetOnlineUsersUseCase,
    LeaveOnlineUseCase,
    CreateDuelUseCase,
    AcceptDuelUseCase,
    GetPendingDuelsUseCase,
    GetActiveBattlesUseCase,
    MakeMoveUseCase,
    GetMyActiveBattleUseCase,
    BattleTickService,
    FinishBattleUseCase,
    {
      provide: BATTLE_RESULT_REPOSITORY,
      useClass: PrismaBattleResultRepository,
    },
    {
      provide: BATTLE_REPOSITORY,
      useClass: RedisBattleRepository,
    },
    {
      provide: DUEL_REPOSITORY,
      useClass: RedisDuelRepository,
    },
    {
      provide: PLAYER_REPOSITORY,
      useClass: RedisPlayerRepository,
    },
  ],
})
export class BattleModule {}
