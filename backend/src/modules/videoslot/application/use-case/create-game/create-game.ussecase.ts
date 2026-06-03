import {
  Injectable,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { GameSession } from '../../../domain/entities/game-session.entity';
import type { IGameSessionRepository } from '../../../domain/repositories/game-session/game-session.repository';
import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session/game-session.repository.token';

import { CreateGameCommand } from './create-game.command';

import { WALLET_REPOSITORY } from '../../../../finance/domain/repositories/wallet/wallet.repository.token';
import type { IWalletRepository } from '../../../../finance/domain/repositories/wallet/wallet.repository';

@Injectable()
export class CreateGameUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute({ userId, mode, walletId }: CreateGameCommand) {
    const existingSession = await this.gameSessionRepository.get(userId);

    if (existingSession) {
      throw new ConflictException('У вас вже є активна ігрова сесія');
    }

    const wallet = await this.walletRepository.findByIdAndUserId(
      walletId,
      userId,
    );

    if (!wallet) {
      throw new NotFoundException('Гаманець не знайдено');
    }

    const gameId = randomUUID();

    const session: GameSession = {
      gameId,
      walletId,
      currency: wallet.currency,
      mode,
      totalSpins: 0,
      totalBets: 0,
      totalWins: 0,
    };

    await this.gameSessionRepository.save(userId, session);

    return { gameId, status: 'initialized', mode };
  }
}
