import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BattleEngine } from '../../domain/services/battle-engine';
import { DUEL_REPOSITORY } from '../../domain/repositories/duel/duel.repository.token';
import { BATTLE_REPOSITORY } from '../../domain/repositories/battle/battle.repository.token';
import type { IDuelRepository } from '../../domain/repositories/duel/duel.repository';
import type { IBattleRepository } from '../../domain/repositories/battle/battle.repository';

@Injectable()
export class AcceptDuelUseCase {
  constructor(
    @Inject(DUEL_REPOSITORY)
    private readonly duelRepository: IDuelRepository,
    @Inject(BATTLE_REPOSITORY)
    private readonly battleRepository: IBattleRepository,
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
