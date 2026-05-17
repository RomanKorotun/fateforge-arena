import { RouletteBet } from 'prisma/generated';

import { RouletteBetEntity } from '../../../domain/entities/roulette-bet.entity';
import { BetType } from '../../../domain/enums/bet-type-enum';

export class PrismaRouletteBetMapper {
  static toDomain(bet: RouletteBet): RouletteBetEntity {
    return new RouletteBetEntity(
      bet.id,
      bet.gameSessionId,
      bet.userId,
      bet.betType as BetType,
      bet.betValue,
      bet.amount,
      bet.winningNumber,
      bet.payoutAmount,
      bet.isWin,
      bet.nonce,
      bet.createdAt,
    );
  }
}
