import { Injectable } from '@nestjs/common';

import { UserRole } from '../../../../../../prisma/generated';

import { PrismaService } from '../../../../../core/prisma/prisma.service';

@Injectable()
export class UserQueryService {
  constructor(private readonly prisma: PrismaService) {}

  // Ппрофіль залогіненого користувача
  async getFullUserProfileById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        username: true,
        profile: {
          select: {
            rating: true,
            balance: true,
            level: true,
            avatar: true,
          },
        },
      },
    });
  }

  // Список користувачів з обмеженою інформацією (для рейтингу/статистики)
  async getPublicUsers() {
    return this.prisma.user.findMany({
      where: { role: UserRole.USER },
      select: {
        username: true,
        createdAt: true,
        profile: {
          select: {
            rating: true,
            level: true,
          },
        },
        address: {
          select: {
            country: true,
          },
        },
      },
    });
  }
}
