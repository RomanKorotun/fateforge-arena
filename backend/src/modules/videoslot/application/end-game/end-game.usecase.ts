import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';

import { RedisService } from '../../../../core/redis/redis.service';
import { GameSession } from '../create-game/create-game.ussecase';
import type { IVideoslotHistoryRepository } from '../../domain/repositories/videosllot-history.repository';

@Injectable()
export class EndGameUseCase {
  constructor(
    private readonly redis: RedisService,
    @Inject("IVideoslotHistoryRepository")
    private readonly historyRepo: IVideoslotHistoryRepository,
  ) {}

  async execute(userId: string, gameId: string) {
    const sessionStr = await this.redis.get(`slot_session:${userId}`);

    if (!sessionStr) {
      throw new NotFoundException('Active session not found');
    }

    const session: GameSession = JSON.parse(sessionStr);

    if (session.gameId !== gameId) {
      throw new BadRequestException('Game ID mismatch');
    }

    await this.redis.del(`slot_session:${userId}`);

    const rtp =
      session.totalBets > 0
        ? (session.totalWins / session.totalBets) * 100
        : 0;

    const history = await this.historyRepo.create({
      userId,
      gameId: session.gameId,
      mode: session.mode,
      totalSpins: session.totalSpins,
      totalBets: session.totalBets,
      totalWins: session.totalWins,
      rtp,
    });

    return {
      message: 'Game session ended successfully',
      stats: history,
    };
  }
}