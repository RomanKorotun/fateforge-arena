import { Currency } from '../../../finance/domain/enums/currency.enum';

export interface GameSession {
  gameId: string;
  walletId: string;
  currency: Currency;
  mode: number;
  totalSpins: number;
  totalBets: number;
  totalWins: number;
}
