import { Injectable } from '@nestjs/common';

import { UserRole } from '../../../../../../prisma/generated';

import { PrismaService } from '../../../../../core/prisma/prisma.service';

@Injectable()
export class UserQueryService {
  constructor(private readonly prisma: PrismaService) {}

  // Профіль залогіненого користувача
  async getFullUserProfileById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        profile: {
          select: { avatar: true },
        },
        wallets: {
          select: { id: true, balance: true, currency: true },
        },
      },
    });
  }

  // інформація про користувачів для побудови рейтингу користувачів в грі battle
  async getBattleLeaderboard({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;

    const where = {
      role: UserRole.USER,
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: {
          profile: { rating: 'desc' },
        },
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          profile: {
            select: { rating: true },
          },
          address: {
            select: { country: true },
          },
        },
      }),

      this.prisma.user.count({ where }),
    ]);

    return { data: users, total };
  }
}
