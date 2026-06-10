export type BattleResultData = {
  player1Id: string;
  player2Id: string;
  winnerId: string | null;
  totalRounds: number;
  player1Health: number;
  player2Health: number;
  player1MovesHistory: any[];
  player2MovesHistory: any[];
};

export interface IBattleResultRepository {
  save(result: BattleResultData): Promise<void>;
}
