import { Module } from '@nestjs/common';

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

@Module({
  imports: [RedisModule, PrismaModule, AuthModule, UserModule],
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
    RedisBattleRepository,
    RedisDuelRepository,
    RedisPlayerRepository,
    PrismaBattleResultRepository,
    BattleTickService,
    FinishBattleUseCase,
  ],
})
export class BattleModule {}
