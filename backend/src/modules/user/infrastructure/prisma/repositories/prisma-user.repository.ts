import { Injectable } from '@nestjs/common';

import type {
  FindAllUsersData,
  IUserRepository,
  UpdateAvatar,
} from '../../../domain/repositories/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { CreateUserData } from '../../../domain/types/create-user.data';
import { PrismaService } from '../../../../../core/prisma/prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import { UpdateLastSigninData } from '../../../domain/types/update-last-signin.data';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // створення користувача + профілю
  async createUser(data: CreateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        profile: {
          create: {
            rating: 0,
            level: 0,
            balance: 0,
          },
        },
      },
    });
    return PrismaUserMapper.toDomain(user);
  }

  // пошук користувача по email
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return PrismaUserMapper.toDomain(user);
  }

  // пошук користувача по id
  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return PrismaUserMapper.toDomain(user);
  }

  // оновлює інформацію про останній вхід користувача (IP та час входу)
  async updateLastSignin({ userId, ip }: UpdateLastSigninData): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginIP: ip,
        lastLoginAt: new Date(),
      },
    });
  }

  // оновлює інформацію про користувача
  async updateUser(userId: string, data: any): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return PrismaUserMapper.toDomain(user);
  }

  // отримати список всіх користувачів
  async findAllUsers({
    skip,
    limit: take,
    role,
    isBanned,
  }: FindAllUsersData): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      where: {
        ...(role !== undefined && { role }),
        ...(isBanned !== undefined && { isBanned }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(PrismaUserMapper.toDomain);
  }

  // оновлює аватар користувача (оновлює аватар в таблиці Profile через таблицю User)
  async updateAvatar({ userId, avatar }: UpdateAvatar): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: {
            avatar,
          },
        },
      },
    });
  }
}
