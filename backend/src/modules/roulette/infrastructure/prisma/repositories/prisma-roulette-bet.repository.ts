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
    await client.rouletteBet.createMany({
      data,
    });
  }

  async findMany({
    userId,
    gameSessionId,
    betType,
    from,
    to,
    page,
    limit,
  }: GetRouletteBetsParams) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId !== undefined) {
      where.userId = userId;
    }

    if (gameSessionId) {
      where.gameSessionId = gameSessionId;
    }

    if (betType) {
      where.betType = betType;
    }

    if (from || to) {
      where.createdAt = {
        ...(from && { gte: from }),
        ...(to && { lte: to }),
      };
    }

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
