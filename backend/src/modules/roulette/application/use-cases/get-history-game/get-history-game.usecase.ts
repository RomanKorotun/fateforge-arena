import { Inject, Injectable } from '@nestjs/common';

import { GetHistoryGameCommand } from './get-history-game.command';

import { ROULETTE_BET_REPOSITORY } from '../../../domain/repositories/roulette-bet.repository.token';
import type { IRouletteBetRepository } from '../../../domain/repositories/roulette-bet.repository';

@Injectable()
export class GetHistoryGameUseCase {
  constructor(
    @Inject(ROULETTE_BET_REPOSITORY)
    private readonly rouletteBetRepository: IRouletteBetRepository,
  ) {}
  async execute({
    userId,
    query: { page, limit, gameSessionId },
  }: GetHistoryGameCommand) {
    const bets = await this.rouletteBetRepository.findMany({
      userId,
      gameSessionId,
      page,
      limit,
    });
    return bets;
  }
}
