import { Currency } from '../../../../finance/domain/enums/currency.enum';
import { VideoslotHistory } from '../../entities/videoslot-history.entity';

export interface VideosloteHistoryParam {
  userId: string;
  gameId: string;
  currency: Currency;
  mode: number;
  totalSpins: number;
  totalBets: number;
  totalWins: number;
  rtp: number;
}

export interface GetVideoslotHistoryParams {
  userId?: string;
  gameId?: string;
  currency?: Currency;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
}

export interface IVideoslotHistoryRepository {
  create(data: VideosloteHistoryParam): Promise<VideoslotHistory>;
  findMany(params: GetVideoslotHistoryParams): Promise<{
    data: VideoslotHistory[];
    total: number;
  }>;
}
