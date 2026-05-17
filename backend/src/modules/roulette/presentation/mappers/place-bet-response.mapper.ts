import { PlaceBetResponse } from '../../application/use-cases/place-bet/place-bet-response';

import { PlaceBetSuccessResponseDto } from '../dto/place-bet/place-bet-success-response.dto';

export class PlaceBetResponseMapper {
  static toDto(result: PlaceBetResponse): PlaceBetSuccessResponseDto {
    return {
      round: result.round,
      winNumber: result.winNumber,

      summary: {
        totalBet: result.totalBet,
        totalPayout: result.totalPayout,
        profit: result.totalPayout - result.totalBet,
      },

      bets: result.bets.map((b) => ({
        betType: b.betType,
        betValue: b.betValue ?? null,
        amount: b.amount,
        payoutAmount: b.payoutAmount,
        isWin: b.isWin,
      })),
    };
  }
}
