import { BetType } from '../../../domain/enums/bet-type-enum';

export interface PlaceBetItem {
  userId: string;
  gameSessionId: string;
  betType: BetType;
  betValue: number | null;
  amount: number;
  winningNumber: number;
  payoutAmount: number;
  isWin: boolean;
  nonce: number;
}

export interface PlaceBetResponse {
  winNumber: number;
  round: number;
  totalBet: number;
  totalPayout: number;
  isWin: boolean;
  bets: PlaceBetItem[];
}
