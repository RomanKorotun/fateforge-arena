import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RedisDuelRepository } from '../../infrastructure/redis/redis-duel.repository';
import { RedisBattleRepository } from '../../infrastructure/redis/redis-battle.repository';
import { BattleEngine } from '../../domain/services/battle-engine';

@Injectable()
export class AcceptDuelUseCase {
  constructor(
    private readonly duelRepository: RedisDuelRepository,
    private readonly battleRepository: RedisBattleRepository,
    private readonly battleEngine: BattleEngine,
  ) {}

  async execute(duelId: string, opponentId: string) {
    // отримати duel
    const duel = await this.duelRepository.get(duelId);
    if (!duel) throw new NotFoundException('Duel not found');

    if (duel.challengerId === opponentId) {
      throw new ConflictException('Ви вже є учасником цієї дуелі');
    }

    // створити battle room
    const battle = this.battleEngine.createRoom(
      duel.id,
      duel.challengerId,
      opponentId,
    );

    // зберегти battle
    await this.battleRepository.save(battle);

    // видалити duel
    await this.duelRepository.delete(duel);

    return { duel, battle };
  }
}
