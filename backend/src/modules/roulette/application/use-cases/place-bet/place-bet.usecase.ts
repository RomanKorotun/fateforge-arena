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

import { UNIT_OF_WORK } from '../../../../../common/tokens/unit-of-work.token';
import type { IUnitOfWork } from '../../../../../common/contracts/unit-of-work.interface';

import { TransactionType } from '../../../../finance/domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../../../finance/domain/enums/transaction-status.enum';
import { WALLET_REPOSITORY } from '../../../../finance/domain/repositories/wallet/wallet.repository.token';
import { TRANSACTION_REPOSITORY } from '../../../../finance/domain/repositories/transaction/transaction.repository.token';
import type { IWalletRepository } from '../../../../finance/domain/repositories/wallet/wallet.repository';
import type { ITransactionRepository } from '../../../../finance/domain/repositories/transaction/transaction.repository';

@Injectable()
export class PlaceBetUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
    @Inject(ROULETTE_BET_REPOSITORY)
    private readonly rouletteBetRepository: IRouletteBetRepository,
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
    private readonly engine: RouletteEngine,
  ) {}

  async execute({ userId, dto }: PlaceBetCommand) {
    const { bets, gameSessionId, walletId } = dto;

    // 1. Отримуємо ігрову сесію (поза транзакцією, бо це read-only логіка)
    const gameSession =
      await this.gameSessionRepository.findById(gameSessionId);

    if (!gameSession) {
      throw new NotFoundException('Game session not found');
    }

    // Перевіряємо чи сесія активна і належить користувачу
    gameSession.ensureActive();
    gameSession.validateOwnership(userId);

    // 2. Вся фінансова і критична логіка виконується атомарно в транзакції
    return this.unitOfWork.transaction(async (tx) => {
      // БЛОКУЄМО ГАМАНЕЦЬ
      const wallet = await this.walletRepo.lockById(walletId, tx);

      if (!wallet || wallet.userId !== userId) {
        throw new NotFoundException('Wallet not found');
      }

      // ВАЛІДАЦІЯ СТАВОК
      this.validateBets(bets);

      // Рахуємо загальну суму ставки
      const totalBet = this.calculateTotalBet(bets);

      // Перевірка балансу
      if (wallet.balance < totalBet) {
        throw new BadRequestException('Insufficient balance');
      }

      let currentBalance = wallet.balance;

      // СПИСАННЯ БАЛАНСУ (BET)
      const balanceBeforeBet = currentBalance;
      currentBalance -= totalBet;
      await this.walletRepo.decreaseBalance(wallet.id, totalBet, tx);

      // Запис фінансової транзакції ставки
      await this.transactionRepo.createTransaction(
        {
          walletId: wallet.id,
          type: TransactionType.BET,
          status: TransactionStatus.COMPLETED,
          amount: totalBet,
          currency: wallet.currency,
          balanceBefore: balanceBeforeBet,
          balanceAfter: currentBalance,
          description: 'Roulette bet',
        },
        tx,
      );

      // ГЕЙМ-ЛОГІКА
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

      // ЗБЕРІГАЄМО СТАВКИ (історія гри)
      await this.rouletteBetRepository.createMany(mappedBets, tx);

      // ОНОВЛЮЄМО ІГРОВУ СЕСІЮ (nonce)
      await this.gameSessionRepository.update(gameSession.id, { nonce }, tx);

      // Виграш
      if (totalPayout > 0) {
        const balanceBefore = currentBalance;
        currentBalance += totalPayout;

        // Збільшуємо баланс
        await this.walletRepo.increaseBalance(wallet.id, totalPayout, tx);

        // Запис транзакції виграшу
        await this.transactionRepo.createTransaction(
          {
            walletId: wallet.id,
            type: TransactionType.WIN,
            status: TransactionStatus.COMPLETED,
            amount: totalPayout,
            currency: wallet.currency,
            balanceBefore,
            balanceAfter: currentBalance,
            description: 'Roulette win',
          },
          tx,
        );
      }

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

  // ВАЛІДАЦІЯ СТАВОК
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

  // ПІДРАХУНОК ЗАГАЛЬНОЇ СТАВКИ
  private calculateTotalBet(bets: Bet[]): number {
    return bets.reduce((sum, b) => sum + b.amount, 0);
  }

  // ІГРОВА ЛОГІКА
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
