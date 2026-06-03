import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core/prisma/prisma.service';

import {
  GetVideoslotHistoryParams,
  type IVideoslotHistoryRepository,
  VideosloteHistoryParam,
} from '../../domain/repositories/videoslot-history/videosllot-history.repository';
import { VideoslotHistory } from '../../domain/entities/videoslot-history.entity';

@Injectable()
export class PrismaVideoslotistoryRepository implements IVideoslotHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: VideosloteHistoryParam): Promise<VideoslotHistory> {
    const result = await this.prisma.videoSlotHistory.create({ data });

    return {
      ...result,
      totalBets: result.totalBets.toNumber(),
      totalWins: result.totalWins.toNumber(),
    };
  }

  async findMany(filters: GetVideoslotHistoryParams) {
    const { page, limit, from, to, userId, gameId, ...data } = filters;

    const skip = (page - 1) * limit;

    const where = {
      ...data,

      ...(userId ? { userId } : {}),
      ...(gameId ? { gameId } : {}),

      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.videoSlotHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.videoSlotHistory.count({ where }),
    ]);

    return {
      data: items.map((i) => ({
        ...i,
        totalBets: i.totalBets.toNumber(),
        totalWins: i.totalWins.toNumber(),
      })),
      total,
    };
  }
}
