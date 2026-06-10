import { Inject, Injectable } from '@nestjs/common';

import { BATTLE_REPOSITORY } from '../../domain/repositories/battle/battle.repository.token';
import type { IBattleRepository } from '../../domain/repositories/battle/battle.repository';

@Injectable()
export class GetMyActiveBattleUseCase {
  constructor(
    @Inject(BATTLE_REPOSITORY)
    private readonly battleRepository: IBattleRepository,
  ) {}

  async execute(userId: string) {
    const battles = await this.battleRepository.getAllActive();

    return (
      battles.find(
        (battle) => battle.player1Id === userId || battle.player2Id === userId,
      ) ?? null
    );
  }
}
