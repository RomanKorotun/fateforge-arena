import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { DuelStatus } from '../../domain/enums/duel-status.enum';
import { DUEL_REPOSITORY } from '../../domain/repositories/duel/duel.repository.token';
import type { IDuelRepository } from '../../domain/repositories/duel/duel.repository';

// створити заявку на дуель
@Injectable()
export class CreateDuelUseCase {
  constructor(
    @Inject(DUEL_REPOSITORY)
    private readonly duelRepo: IDuelRepository,
  ) {}

  async execute(challengerId: string, challengerUsername: string) {
    // перевірка чи вже є заявка
    const existing = await this.duelRepo.getByChallengerId(challengerId);

    if (existing) {
      throw new ConflictException(
        'У вас вже є активна заявка на дуель. Ви зможете створити нову після завершення поточної.',
      );
    }

    const duel = {
      id: crypto.randomUUID(),
      challengerId,
      status: DuelStatus.WAITING,
      createdAt: new Date().toISOString(),
      challengerUsername,
    };

    await this.duelRepo.save(duel);

    return duel;
  }
}
