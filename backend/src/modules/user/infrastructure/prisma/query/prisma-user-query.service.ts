// import { Injectable } from '@nestjs/common';

// import { PrismaService } from '../../../../../core/prisma/prisma.service';
// import { PrismaUserMapper } from '../mappers/prisma-user.mapper';

// @Injectable()
// export class UserQueryService {
//   constructor(private readonly prisma: PrismaService) {}

//   async getFullUserProfileById(id: string) {
//     const user = await this.prisma.user.findUnique({
//       where: { id },
//       include: {
//         profile: true,
//         address: true,
//       },
//     });

//     if (!user) return null;
//     return PrismaUserMapper.toDomainWithRelations(user);
//   }
// }

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';

@Injectable()
export class UserQueryService {
  constructor(private readonly prisma: PrismaService) {}

  // Повний профіль залогіненого користувача
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
        address: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            address: true,
            address2: true,
            city: true,
            country: true,
            postalCode: true,
          },
        },
      },
    });
  }

  // Список користувачів з обмеженою інформацією (для рейтингу/статистики)
  async getPublicUsers() {
    return this.prisma.user.findMany({
      where: { role: 1 },
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
