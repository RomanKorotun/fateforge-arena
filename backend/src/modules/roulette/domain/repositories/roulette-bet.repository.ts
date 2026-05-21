import { RouletteBetEntity } from '../entities/roulette-bet.entity';
import { BetType } from '../enums/bet-type-enum';

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

export interface GetRouletteBetsParams {
  userId?: string;
  gameSessionId?: string;
  betType?: BetType;
  from?: Date;
  to?: Date;

  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface IRouletteBetRepository {
  createMany(data: CreateRouletteBetData[], tx?: unknown): Promise<void>;
  findMany(
    params: GetRouletteBetsParams,
    tx?: unknown,
  ): Promise<PaginatedResult<RouletteBetEntity>>;
}
