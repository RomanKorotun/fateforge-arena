import { ConflictException, Injectable } from '@nestjs/common';

import { DuelStatus } from '../../domain/enums/duel-status.enum';
import { RedisDuelRepository } from '../../infrastructure/redis/redis-duel.repository';

// створити заявку на дуель
@Injectable()
export class CreateDuelUseCase {
  constructor(private readonly duelRepo: RedisDuelRepository) {}

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
