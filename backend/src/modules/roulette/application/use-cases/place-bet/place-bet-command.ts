import { BetType } from '../../../domain/enums/bet-type-enum';

export interface Bet {
  type: BetType;
  value?: number;
  amount: number;
}

export interface PlaceBetCommand {
  userId: string;
  dto: {
    gameSessionId: string;
    bets: Bet[];
  };
}
