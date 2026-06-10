import { Server } from 'socket.io';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { BattleEngine } from '../../domain/services/battle-engine';
import { BattleStatus } from '../../domain/enums/battle-status.enum';
import { FinishBattleUseCase } from '../battle/finish-battle.use-case';
import { BATTLE_REPOSITORY } from '../../domain/repositories/battle/battle.repository.token';
import type { IBattleRepository } from '../../domain/repositories/battle/battle.repository';

@Injectable()
export class BattleTickService implements OnModuleInit {
  private server!: Server;

  constructor(
    @Inject(BATTLE_REPOSITORY)
    private readonly battleRepo: IBattleRepository,
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
