import { Injectable } from '@nestjs/common';

import { RedisBattleRepository } from '../../infrastructure/redis/redis-battle.repository';
import { BattleRoom } from '../../domain/entities/battle-room.entity';

@Injectable()
export class GetActiveBattlesUseCase {
  constructor(private readonly battleRepository: RedisBattleRepository) {}

  async execute(): Promise<BattleRoom[]> {
    return this.battleRepository.getAllActive();
  }
}
