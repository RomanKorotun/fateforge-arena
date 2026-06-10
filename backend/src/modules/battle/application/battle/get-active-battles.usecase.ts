import { Inject, Injectable } from '@nestjs/common';

import { BattleRoom } from '../../domain/entities/battle-room.entity';
import { BATTLE_REPOSITORY } from '../../domain/repositories/battle/battle.repository.token';
import type { IBattleRepository } from '../../domain/repositories/battle/battle.repository';

@Injectable()
export class GetActiveBattlesUseCase {
  constructor(
    @Inject(BATTLE_REPOSITORY)
    private readonly battleRepository: IBattleRepository,
  ) {}

  async execute(): Promise<BattleRoom[]> {
    return this.battleRepository.getAllActive();
  }
}
