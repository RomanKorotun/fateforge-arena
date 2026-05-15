// import {
//   BadRequestException,
//   Inject,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';

// import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session.repository.token';
// import { ROULETTE_BET_REPOSITORY } from '../../../domain/repositories/roulette-bet.repository.token';

// import type { IGameSessionRepository } from '../../../domain/repositories/game-session.repository';
// import type { IRouletteBetRepository } from '../../../domain/repositories/roulette-bet.repository';

// import { Bet, PlaceBetCommand } from './place-bet-command';

// import { RouletteEngine } from '../../../domain/engine/roulette.engine';
// import { BetType } from '../../../domain/enums/bet-type-enum';
// import { WALLET_REPOSITORY } from '../../../../finance/domain/repositories/wallet.repository.token';
// import type { IWalletRepository } from '../../../../finance/domain/repositories/wallet.repository';

// @Injectable()
// export class PlaceBetUseCase {
//   constructor(
//     @Inject(GAME_SESSION_REPOSITORY)
//     private readonly gameSessionRepository: IGameSessionRepository,
//     @Inject(ROULETTE_BET_REPOSITORY)
//     @Inject(WALLET_REPOSITORY)
//     private readonly walletRepo: IWalletRepository,
//     private readonly rouletteBetRepository: IRouletteBetRepository,
//     private readonly engine: RouletteEngine,
//   ) {}

//   async execute({ userId, dto: { bets, gameSessionId, walletId } }: PlaceBetCommand) {
//     const gameSession =
//       await this.gameSessionRepository.findById(gameSessionId);

//     if (!gameSession) {
//       throw new NotFoundException('Game session not found');
//     }

//     gameSession.ensureActive();
//     gameSession.validateOwnership(userId);

//     this.validateBets(bets);

//     const totalBet = this.calculateTotalBet(bets);

//     const wallet = await this.walletRepo.lockById(userId);

//     const nonce = gameSession.incrementNonce();

//     const winNumber = this.engine.generateNumber(
//       gameSession.serverSeed,
//       gameSession.clientSeed,
//       nonce,
//     );

//     const { mappedBets, totalPayout } = this.processBets(
//       bets,
//       userId,
//       gameSession.id,
//       winNumber,
//       nonce,
//     );

//     await this.rouletteBetRepository.createMany(mappedBets);
//     await this.gameSessionRepository.update(gameSession.id, { nonce });

//     return {
//       winNumber,
//       round: nonce,
//       totalBet,
//       totalPayout,
//       isWin: totalPayout > 0,
//       bets: mappedBets,
//     };
//   }

//   // Перевіряє коректність ставок відповідно до правил рулетки
//   private validateBets(bets: Bet[]) {
//     for (const bet of bets) {
//       const isStraight = bet.type === BetType.STRAIGHT;
//       const hasValue = bet.value !== null && bet.value !== undefined;

//       if (!isStraight && hasValue) {
//         throw new BadRequestException(`${bet.type} bet cannot have value`);
//       }

//       if (isStraight && !hasValue) {
//         throw new BadRequestException('STRAIGHT bet requires value');
//       }
//     }
//   }

//   // Рахує загальну суму всіх ставок у раунді
//   private calculateTotalBet(bets: Bet[]): number {
//     return bets.reduce((sum, b) => sum + b.amount, 0);
//   }

//   // Обробляє ставки: визначає результат, рахує виграш і формує дані для збереження
//   private processBets(
//     bets: Bet[],
//     userId: string,
//     gameSessionId: string,
//     winNumber: number,
//     nonce: number,
//   ) {
//     let totalPayout = 0;

//     const mappedBets = bets.map((bet) => {
//       const isWin = this.engine.checkWin(bet.type, bet.value, winNumber);

//       const payout = isWin
//         ? bet.amount * this.engine.getMultiplier(bet.type)
//         : 0;

//       totalPayout += payout;

//       return {
//         userId,
//         gameSessionId,
//         betType: bet.type,
//         betValue: bet.value ?? null,
//         amount: bet.amount,
//         winningNumber: winNumber,
//         payoutAmount: payout,
//         isWin,
//         nonce,
//       };
//     });

//     return { mappedBets, totalPayout };
//   }
// }

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

import { WALLET_REPOSITORY } from '../../../../finance/domain/repositories/wallet.repository.token';
import type { IWalletRepository } from '../../../../finance/domain/repositories/wallet.repository';

import { UNIT_OF_WORK } from '../../../../../common/tokens/unit-of-work.token';
import type { IUnitOfWork } from '../../../../../common/contracts/unit-of-work.interface';

@Injectable()
export class PlaceBetUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
    @Inject(ROULETTE_BET_REPOSITORY)
    private readonly rouletteBetRepository: IRouletteBetRepository,
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
    private readonly engine: RouletteEngine,
  ) {}

  async execute({ userId, dto }: PlaceBetCommand) {
    return this.unitOfWork.transaction(async (tx) => {
      const { bets, gameSessionId, walletId} = dto;

      // 1. LOCK гаманець (ВАЖЛИВО для race condition)
      const wallet = await this.walletRepo.lockById(walletId, tx);

      if (!wallet || wallet.userId !== userId) {
        throw new NotFoundException('Wallet not found');
      }

      // 2. перевірка ставок
      this.validateBets(bets);

      const totalBet = this.calculateTotalBet(bets);

      // 3. перевірка балансу
      if (wallet.balance < totalBet) {
        throw new BadRequestException('Insufficient balance');
      }

      // =========================================================
      // 4. СПИСАННЯ БАЛАНСУ (ЦЕ МОМЕНТ BET)
      // =========================================================
      await this.walletRepo.decreaseBalance(wallet.id, totalBet, tx);

      // 5. гра
      const gameSession =
        await this.gameSessionRepository.findById(gameSessionId);

      if (!gameSession) {
        throw new NotFoundException('Game session not found');
      }

      gameSession.ensureActive();
      gameSession.validateOwnership(userId);

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

      // 6. зберігаємо ставки
      await this.rouletteBetRepository.createMany(mappedBets);

      // 7. оновлюємо сесію
      await this.gameSessionRepository.update(gameSession.id, { nonce });

      // =========================================================
      // 🟢 8. ВИГРАШ → ДОДАЄМО ДО БАЛАНСУ
      // =========================================================
      if (totalPayout > 0) {
        await this.walletRepo.increaseBalance(
          wallet.id,
          totalPayout,
          tx,
        );
      }

      // 9. відповідь
      return {
        winNumber,
        round: nonce,
        totalBet,
        totalPayout,
        isWin: totalPayout > 0,
        bets: mappedBets,
      };
    });
  }

  // =========================
  // VALIDATION
  // =========================
  private validateBets(bets: Bet[]) {
    for (const bet of bets) {
      const isStraight = bet.type === BetType.STRAIGHT;
      const hasValue = bet.value !== null && bet.value !== undefined;

      if (!isStraight && hasValue) {
        throw new BadRequestException(`${bet.type} cannot have value`);
      }

      if (isStraight && !hasValue) {
        throw new BadRequestException('STRAIGHT requires value');
      }
    }
  }

  // =========================
  // TOTAL BET
  // =========================
  private calculateTotalBet(bets: Bet[]): number {
    return bets.reduce((sum, b) => sum + b.amount, 0);
  }

  // =========================
  // PROCESS BETS
  // =========================
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
