import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { type IVideoslotHistoryRepository, VideosloteHistoryParam } from '../../domain/repositories/videosllot-history.repository';

@Injectable()
export class PrismaVideoslotistoryRepository implements IVideoslotHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: VideosloteHistoryParam) {
    return this.prisma.videoSlotHistory.create({
      data: {
        userId: data.userId,
        gameId: data.gameId,
        mode: data.mode,
        totalSpins: data.totalSpins,
        totalBets: data.totalBets,
        totalWins: data.totalWins,
        rtp: data.rtp,
      },
    });
  }
}