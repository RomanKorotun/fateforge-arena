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

  // Список користувачів з обмеженою інформацією (для рейтингу/статистики)
  async getPublicUsers() {
    const users = await this.prisma.user.findMany({
      where: { role: UserRole.USER },
      select: {
        username: true,
        createdAt: true,
        profile: { select: { rating: true, level: true } },
        address: { select: { country: true } },
      },
    });

    return users.map((user) => ({
      username: user.username,
      createdAt: user.createdAt,
      country: user.address?.country || null,
      profile: { rating: user.profile?.rating, level: user.profile?.level },
    }));
  }

  // інформація для побудови рейтингу користувачів в грі battle
  async getBattleLeaderboard() {
    const users = await this.prisma.user.findMany({
      where: {
        role: UserRole.USER,
        isDeleted: false,
      },
      orderBy: {
        profile: { rating: 'desc' },
      },
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
    });

    return users;
  }
}
