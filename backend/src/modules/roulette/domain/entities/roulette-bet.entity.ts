import { BetType } from '../enums/bet-type-enum';

export class RouletteBetEntity {
  constructor(
    public readonly id: string,
    public readonly gameSessionId: string,
    public readonly userId: string,
    public readonly betType: BetType,
    public readonly betValue: number | null,
    public readonly amount: number,
    public readonly winningNumber: number,
    public readonly payoutAmount: number,
    public readonly isWin: boolean,
    public readonly nonce: number,
    public readonly createdAt: Date,
  ) {}
}
