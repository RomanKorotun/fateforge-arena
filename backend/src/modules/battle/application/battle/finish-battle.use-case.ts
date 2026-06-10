import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PROFILE_REPOSITORY } from '../../../user/domain/repositories/profile.repository.token';
import type { IProfileRepository } from '../../../user/domain/repositories/profile.repository';

import { BATTLE_RESULT_REPOSITORY } from '../../domain/repositories/battle-result/battle-result.repository.token';
import type { IBattleResultRepository } from '../../domain/repositories/battle-result/battle-result.repository';
import { BATTLE_REPOSITORY } from '../../domain/repositories/battle/battle.repository.token';
import type { IBattleRepository } from '../../domain/repositories/battle/battle.repository';

// фінал бою
@Injectable()
export class FinishBattleUseCase {
  constructor(
    @Inject(BATTLE_REPOSITORY)
    private readonly battleRepository: IBattleRepository,
    @Inject(BATTLE_RESULT_REPOSITORY)
    private readonly resultRepo: IBattleResultRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(roomId: string) {
    const room = await this.battleRepository.get(roomId);

    if (!room) {
      throw new NotFoundException();
    }

    const isDraw = !room.winnerId;

    const saveBattle = {
      player1Id: room.player1Id,
      player2Id: room.player2Id,
      winnerId: room.winnerId,
      totalRounds: room.currentRound,
      player1Health: room.player1Health,
      player2Health: room.player2Health,
      player1MovesHistory: room.player1MovesHistory,
      player2MovesHistory: room.player2MovesHistory,
    };

    if (room.winnerId) {
      const winnerId = room.winnerId;
      const loserId =
        winnerId === room.player1Id ? room.player2Id : room.player1Id;

      await this.profileRepository.incrementRating(winnerId, 2);
      await this.profileRepository.incrementRating(loserId, 0);
    }

    if (isDraw) {
      await this.profileRepository.incrementRating(room.player1Id, 1);
      await this.profileRepository.incrementRating(room.player2Id, 1);
    }

    await this.resultRepo.save(saveBattle);
    await this.battleRepository.delete(roomId);

    return room;
  }
}
