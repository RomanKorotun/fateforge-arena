export interface VideoslotHistory {
  id: string;
  userId: string;
  gameId: string;
  mode: number;
  totalSpins: number;
  totalBets: number;
  totalWins: number;
  rtp: number;
  createdAt: Date;
}
