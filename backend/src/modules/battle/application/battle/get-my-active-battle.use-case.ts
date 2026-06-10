import { Injectable } from '@nestjs/common';

import { RedisBattleRepository } from '../../infrastructure/redis/redis-battle.repository';

@Injectable()
export class GetMyActiveBattleUseCase {
  constructor(private readonly battleRepo: RedisBattleRepository) {}

  async execute(userId: string) {
    const battles = await this.battleRepo.getAllActive();

    return (
      battles.find(
        (battle) => battle.player1Id === userId || battle.player2Id === userId,
      ) ?? null
    );
  }
}
