import { Injectable } from '@nestjs/common';

import { RedisDuelRepository } from '../../infrastructure/redis/redis-duel.repository';

// список pending заявок
@Injectable()
export class GetPendingDuelsUseCase {
  constructor(private readonly duelRepo: RedisDuelRepository) {}

  async execute() {
    return this.duelRepo.getPending();
  }
}
