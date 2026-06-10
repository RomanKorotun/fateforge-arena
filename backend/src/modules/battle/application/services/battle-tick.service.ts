import { Server } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { RedisBattleRepository } from '../../infrastructure/redis/redis-battle.repository';
import { BattleEngine } from '../../domain/services/battle-engine';
import { BattleStatus } from '../../domain/enums/battle-status.enum';
import { FinishBattleUseCase } from '../battle/finish-battle.use-case';

@Injectable()
export class BattleTickService implements OnModuleInit {
  private server!: Server;

  // private readonly BATTLE_DURATION = 5 * 60 * 1000;

  constructor(
    private readonly battleRepo: RedisBattleRepository,
    private readonly engine: BattleEngine,
    private readonly finishBattleUseCase: FinishBattleUseCase,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  onModuleInit() {
    setInterval(async () => {
      const battles = await this.battleRepo.getAllActive();
      const now = Date.now();

      for (const battle of battles) {
   
        const roundExpired = now > battle.roundDeadline;

        const bothPlayed = battle.player1RoundMove && battle.player2RoundMove;

        this.server.to(`battle:${battle.id}`).emit('battle:timer', {
          battleId: battle.id,
          roundLeft: Math.max(0, battle.roundDeadline - now),
          // battleLeft: Math.max(
          //   0,
          //   battle.createdAt + this.BATTLE_DURATION - now,
          // ),
        });

        if (!(roundExpired || bothPlayed)) continue;

        const updated = this.engine.processRound(battle);

        await this.battleRepo.save(updated);

        this.server
          .to(`battle:${battle.id}`)
          .emit('battle:round-result', updated);

        if (updated.status === BattleStatus.FINISHED) {
          await this.finishBattleUseCase.execute(battle.id);
        }
      }
    }, 1000);
  }
}


