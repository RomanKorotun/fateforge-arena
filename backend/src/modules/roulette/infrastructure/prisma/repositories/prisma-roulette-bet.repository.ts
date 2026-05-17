import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';
import {
  CreateRouletteBetData,
  FindRouletteBedAll,
  IRouletteBetRepository,
} from '../../../domain/repositories/roulette-bet.repository';
import { PrismaRouletteBetMapper } from '../mappers/prisma-roulette-bet.mapper';

@Injectable()
export class PrismaRouletteBetRepository implements IRouletteBetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(data: CreateRouletteBetData[]): Promise<void> {
    await this.prisma.rouletteBet.createMany({
      data,
    });
  }

  async findMany({ userId, gameSessionId, page, limit }: FindRouletteBedAll) {
    const skip = (page - 1) * limit;
    const bets = await this.prisma.rouletteBet.findMany({
      where: {
        ...(userId && { userId }),
        ...(gameSessionId && { gameSessionId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return bets.map(PrismaRouletteBetMapper.toDomain);
  }
}
