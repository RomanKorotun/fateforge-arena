import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomInt } from 'crypto';

import { PlaySpinCommand } from './play-spin.command';

import {
  PAYLINES_CONFIG,
  PAYTABLE,
  WILD_SYMBOL,
} from '../../../domain/constants/videoslots.constants';

import { WALLET_REPOSITORY } from '../../../../../modules/finance/domain/repositories/wallet/wallet.repository.token';
import type { IWalletRepository } from '../../../../../modules/finance/domain/repositories/wallet/wallet.repository';

import { TRANSACTION_REPOSITORY } from '../../../../../modules/finance/domain/repositories/transaction/transaction.repository.token';
import type { ITransactionRepository } from '../../../../../modules/finance/domain/repositories/transaction/transaction.repository';

import { UNIT_OF_WORK } from '../../../../../common/tokens/unit-of-work.token';
import type { IUnitOfWork } from '../../../../../common/contracts/unit-of-work.interface';

import { ReelGeneratorService } from '../../services/reel-generator.service';
import { TransactionType } from '../../../../../modules/finance/domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../../../../modules/finance/domain/enums/transaction-status.enum';
import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session/game-session.repository.token';
import type { IGameSessionRepository } from '../../../domain/repositories/game-session/game-session.repository';

// Результат виграшної лінії
type WinningLine = {
  lineId: number;
  matchCount: number;
  symbol: number;
  winAmount: number;
};

@Injectable()
export class PlaySpinUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
    private readonly reelGeneratorService: ReelGeneratorService,
  ) {}

  async execute({ userId, data }: PlaySpinCommand) {
    const { bet, lines } = data;

    // 1. Отримуємо ігрову сесію з Redis
    const session = await this.gameSessionRepository.get(userId);

    if (!session) {
      throw new NotFoundException(
        'Ігрову сесію не знайдено. Спочатку ініціалізуй гру.',
      );
    }

    // 2. ВСЯ ФІНАНСОВА ЛОГІКА В POSTGRES ТРАНЗАКЦІЇ
    return this.unitOfWork.transaction(async (tx) => {
      // Блокуємо гаманець (щоб не було race condition)
      const wallet = await this.walletRepository.lockById(session.walletId, tx);

      if (!wallet || wallet.userId !== userId) {
        throw new NotFoundException('Гаманець не знайдено');
      }

      // Перевірка балансу
      if (wallet.balance < bet) {
        throw new BadRequestException('Недостатньо коштів');
      }

      const betPerLine = bet / lines.length;

      // 3. RNG: генерація барабанів
      const reels = this.reelGeneratorService.generate(session.mode);

      const grid: number[][] = [[], [], [], [], []];

      for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
        const reelLength = reels[reelIndex].length;
        const stopIndex = randomInt(0, reelLength);

        // 3 символи на кожен барабан (видима частина)
        grid[reelIndex] = [
          reels[reelIndex][stopIndex],
          reels[reelIndex][(stopIndex + 1) % reelLength],
          reels[reelIndex][(stopIndex + 2) % reelLength],
        ];
      }

      // 4. РОЗРАХУНОК ВИГРАШІВ
      let totalWin = 0;
      const winningLines: WinningLine[] = [];

      for (const lineId of lines) {
        const linePattern = PAYLINES_CONFIG[lineId];
        if (!linePattern) continue;

        const lineSymbols = linePattern.map(
          (rowIndex, reelIndex) => grid[reelIndex][rowIndex],
        );

        let matchCount = 1;

        // стартовий символ (з урахуванням WILD)
        let targetSymbol =
          lineSymbols[0] === WILD_SYMBOL ? lineSymbols[1] : lineSymbols[0];

        for (let i = 1; i < 5; i++) {
          if (
            lineSymbols[i] === targetSymbol ||
            lineSymbols[i] === WILD_SYMBOL ||
            targetSymbol === WILD_SYMBOL
          ) {
            matchCount++;

            // якщо перший був WILD — фіксуємо реальний символ
            if (
              targetSymbol === WILD_SYMBOL &&
              lineSymbols[i] !== WILD_SYMBOL
            ) {
              targetSymbol = lineSymbols[i];
            }
          } else {
            break;
          }
        }

        // перевірка виплати
        if (matchCount >= 3 && targetSymbol !== WILD_SYMBOL) {
          const multiplier = PAYTABLE[targetSymbol]?.[matchCount] ?? 0;

          if (multiplier > 0) {
            // const winAmount = betPerLine * multiplier;
            const winAmount = Math.round(betPerLine * multiplier * 100) / 100;

            // totalWin += winAmount;
            totalWin = Math.round((totalWin + winAmount) * 100) / 100;

            winningLines.push({
              lineId,
              matchCount,
              symbol: targetSymbol,
              winAmount,
            });
          }
        }
      }

      // 5. СПИСАННЯ СТАВКИ (BET)
      const balanceBeforeBet = wallet.balance;
      const balanceAfterBet = balanceBeforeBet - bet;

      await this.walletRepository.decreaseBalance(wallet.id, bet, tx);

      await this.transactionRepository.createTransaction(
        {
          walletId: wallet.id,
          type: TransactionType.BET,
          status: TransactionStatus.COMPLETED,
          amount: bet,
          currency: wallet.currency,
          balanceBefore: balanceBeforeBet,
          balanceAfter: balanceAfterBet,
          description: 'Ставка в слоті',
        },
        tx,
      );

      // 6. ВИПЛАТА (WIN)
      let finalBalance = balanceAfterBet;

      if (totalWin > 0) {
        const balanceBeforeWin = finalBalance;
        finalBalance += totalWin;

        await this.walletRepository.increaseBalance(wallet.id, totalWin, tx);

        await this.transactionRepository.createTransaction(
          {
            walletId: wallet.id,
            type: TransactionType.WIN,
            status: TransactionStatus.COMPLETED,
            amount: totalWin,
            currency: wallet.currency,
            balanceBefore: balanceBeforeWin,
            balanceAfter: finalBalance,
            description: 'Виграш у слоті',
          },
          tx,
        );
      }

      // 7. ОНОВЛЕННЯ СЕСІЇ (Redis)
      session.totalSpins += 1;
      session.totalBets += bet;
      session.totalWins += totalWin;

      await this.gameSessionRepository.save(userId, session);

      // 8. ФОРМУВАННЯ ВІДПОВІДІ
      const viewGrid = [0, 1, 2].map((row) => grid.map((col) => col[row]));

      return {
        grid: viewGrid,
        winningLines,
        totalWin,
        betAmount: bet,
      };
    });
  }
}
