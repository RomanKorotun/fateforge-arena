import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService } from '../../../../core/redis/redis.service';

export interface GameSession {
  gameId: string;
  mode: number; // 1 - GAME, 0 - TEST
  totalSpins: number;
  totalBets: number;
  totalWins: number;
}

@Injectable()
export class CreateGameUseCase {
  constructor(private redis: RedisService) {}
  async execute(userId: string, mode: number) {
    const gameId = randomUUID();
    const session: GameSession = {
      gameId,
      mode,
      totalSpins: 0,
      totalBets: 0,
      totalWins: 0,
    };
    await this.redis.set(`slot_session:${userId}`, JSON.stringify(session));
    return { gameId, status: 'initialized', mode };
  }
}
