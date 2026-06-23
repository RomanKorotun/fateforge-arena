import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';
import {
  CreateRouletteBetData,
  GetRouletteBetsParams,
  IRouletteBetRepository,
} from '../../../domain/repositories/roulette-bet.repository';
import { PrismaRouletteBetMapper } from '../mappers/prisma-roulette-bet.mapper';

import { PrismaTx } from '../../../../../core/prisma/prisma.types';

@Injectable()
export class PrismaRouletteBetRepository implements IRouletteBetRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: PrismaTx) {
    return tx ?? this.prisma;
  }

  async createMany(
    data: CreateRouletteBetData[],
    tx?: PrismaTx,
  ): Promise<void> {
    const client = this.getClient(tx);
    await client.rouletteBet.createMany({ data });
  }

  // отримати список ставок
  async findMany(params: GetRouletteBetsParams) {
    const { userId, gameSessionId, betType, from, to, page, limit } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(userId && { userId }),
      ...(gameSessionId && { gameSessionId }),
      ...(betType && { betType }),
      ...((from || to) && {
        createdAt: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
        },
      }),
    };

    const [bets, total] = await Promise.all([
      this.prisma.rouletteBet.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.rouletteBet.count({ where }),
    ]);

    return {
      data: bets.map(PrismaRouletteBetMapper.toDomain),
      total,
    };
  }
}
