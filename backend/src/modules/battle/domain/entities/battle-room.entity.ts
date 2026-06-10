import { Move } from './move.entity';
import { BattleStatus } from '../enums/battle-status.enum';

export class BattleRoom {
  constructor(
    public id: string,
    public player1Id: string,
    public player2Id: string,

    public status: BattleStatus,
    public createdAt: number,

    public currentRound: number,
    public roundDeadline: number,

    public player1Health: number,
    public player2Health: number,

    public player1RoundMove: Move | null,
    public player2RoundMove: Move | null,

    public player1MovesHistory: Move[],
    public player2MovesHistory: Move[],

    public winnerId: string | null,
  ) {}
}
