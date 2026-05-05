import { BetType } from "../../../domain/enums/bet-type-enum";

export interface Bet {
  type: BetType;
  value?: number;
  amount: number;
}

export interface PlaceBetCommand {
  gameSessionId: string;
  bets: Bet[];
}