export interface VideosloteHistoryParam {
  userId: string;
  gameId: string;
  mode: number;
  totalSpins: number;
  totalBets: number;
  totalWins: number;
  rtp: number;
}

export interface IVideoslotHistoryRepository {
  create(data: VideosloteHistoryParam): Promise<any>;
}