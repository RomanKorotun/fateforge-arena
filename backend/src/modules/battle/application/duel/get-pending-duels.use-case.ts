import { Inject, Injectable } from '@nestjs/common';

import { DUEL_REPOSITORY } from '../../domain/repositories/duel/duel.repository.token';
import type { IDuelRepository } from '../../domain/repositories/duel/duel.repository';

// список pending заявок
@Injectable()
export class GetPendingDuelsUseCase {
  constructor(
    @Inject(DUEL_REPOSITORY)
    private readonly duelRepo: IDuelRepository,
  ) {}

  async execute() {
    return this.duelRepo.getPending();
  }
}
