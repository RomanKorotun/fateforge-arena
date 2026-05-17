import { RouletteBetEntity } from '../../domain/entities/roulette-bet.entity';

import { GetHistoryGameSuccessResponseDto } from '../dto/get-history-game/get-history-game-success-response.dto';

export class GetHistoryGameResponseMapper {
  static toDto(entity: RouletteBetEntity): GetHistoryGameSuccessResponseDto {
    return {
      id: entity.id,
      gameSessionId: entity.gameSessionId,
      round: entity.nonce,
      betType: entity.betType,
      betValue: entity.betValue,
      amount: entity.amount,
      winningNumber: entity.winningNumber,
      payoutAmount: entity.payoutAmount,
      isWin: entity.isWin,
      profit: entity.payoutAmount - entity.amount,
      createdAt: entity.createdAt,
    };
  }

  static toDtoList(
    entities: RouletteBetEntity[],
  ): GetHistoryGameSuccessResponseDto[] {
    return entities.map(this.toDto);
  }
}
