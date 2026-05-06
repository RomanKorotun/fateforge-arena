import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session.repository.token';
import { ROULETTE_BET_REPOSITORY } from '../../../domain/repositories/roulette-bet.repository.token';

import type { IGameSessionRepository } from '../../../domain/repositories/game-session.repository';
import type { IRouletteBetRepository } from '../../../domain/repositories/roulette-bet.repository';

import { Bet, PlaceBetCommand } from './place-bet-command';

import { RouletteEngine } from '../../../domain/engine/roulette.engine';
import { BetType } from '../../../domain/enums/bet-type-enum';

@Injectable()
export class PlaceBetUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
    @Inject(ROULETTE_BET_REPOSITORY)
    private readonly rouletteBetRepository: IRouletteBetRepository,
    private readonly engine: RouletteEngine,
  ) {}

  async execute({ userId, dto: { bets, gameSessionId } }: PlaceBetCommand) {
    const gameSession =
      await this.gameSessionRepository.findById(gameSessionId);

    if (!gameSession) {
      throw new NotFoundException('Game session not found');
    }

    gameSession.ensureActive();
    gameSession.validateOwnership(userId);

    this.validateBets(bets);

    const totalBet = this.calculateTotalBet(bets);
    const nonce = gameSession.incrementNonce();

    const winNumber = this.engine.generateNumber(
      gameSession.serverSeed,
      gameSession.clientSeed,
      nonce,
    );

    const { mappedBets, totalPayout } = this.processBets(
      bets,
      userId,
      gameSession.id,
      winNumber,
      nonce,
    );

    await this.rouletteBetRepository.createMany(mappedBets);
    await this.gameSessionRepository.update(gameSession.id, { nonce });

    return {
      winNumber,
      round: nonce,
      totalBet,
      totalPayout,
      isWin: totalPayout > 0,
      bets: mappedBets,
    };
  }

  // Перевіряє коректність ставок відповідно до правил рулетки
  private validateBets(bets: Bet[]) {
    for (const bet of bets) {
      const isStraight = bet.type === BetType.STRAIGHT;
      const hasValue = bet.value !== null && bet.value !== undefined;

      if (!isStraight && hasValue) {
        throw new BadRequestException(`${bet.type} bet cannot have value`);
      }

      if (isStraight && !hasValue) {
        throw new BadRequestException('STRAIGHT bet requires value');
      }
    }
  }

  // Рахує загальну суму всіх ставок у раунді
  private calculateTotalBet(bets: Bet[]): number {
    return bets.reduce((sum, b) => sum + b.amount, 0);
  }

  // Обробляє ставки: визначає результат, рахує виграш і формує дані для збереження
  private processBets(
    bets: Bet[],
    userId: string,
    gameSessionId: string,
    winNumber: number,
    nonce: number,
  ) {
    let totalPayout = 0;

    const mappedBets = bets.map((bet) => {
      const isWin = this.engine.checkWin(bet.type, bet.value, winNumber);

      const payout = isWin
        ? bet.amount * this.engine.getMultiplier(bet.type)
        : 0;

      totalPayout += payout;

      return {
        userId,
        gameSessionId,
        betType: bet.type,
        betValue: bet.value ?? null,
        amount: bet.amount,
        winningNumber: winNumber,
        payoutAmount: payout,
        isWin,
        nonce,
      };
    });

    return { mappedBets, totalPayout };
  }
}
