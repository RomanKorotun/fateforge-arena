import { BetType } from 'prisma/generated';

import { RouletteBetEntity } from '../entities/roulette-bet.entity';

export interface CreateRouletteBetData {
  gameSessionId: string;
  userId: string;
  betType: BetType;
  betValue: number | null;
  amount: number;
  winningNumber: number;
  payoutAmount: number;
  isWin: boolean;
  nonce: number;
}

export interface FindRouletteBedAll {
  userId?: string;
  gameSessionId?: string;
  page: number;
  limit: number;
}

export interface IRouletteBetRepository {
  createMany(data: CreateRouletteBetData[]): Promise<void>;
  findMany(data: FindRouletteBedAll): Promise<RouletteBetEntity[]>;
}
