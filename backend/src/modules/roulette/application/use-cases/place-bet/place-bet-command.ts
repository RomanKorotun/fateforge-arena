import { BetType } from '../../../domain/enums/bet-type-enum';

export interface Bet {
  type: BetType;
  value?: number;
  amount: number;
}

export interface PlaceBetCommand {
  userId: string;
  dto: {
    walletId: string;
    gameSessionId: string;
    bets: Bet[];
  };
}
