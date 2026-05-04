import { Injectable } from '@nestjs/common';

import type {
  CreateUserData,
  FindAllUsersData,
  IUserRepository,
  UpdateAvatar,
  UpdateUserData,
} from '../../../domain/repositories/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { PrismaService } from '../../../../../core/prisma/prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import { UserEntityWithPassword } from '../../../domain/entities/user-with-password.type';

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

  // пошук користувача по email разом із password hash
  async findByEmailWithPassword(
    email: string,
  ): Promise<UserEntityWithPassword | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return PrismaUserMapper.toDomainWithPassword(user);
  }

  // пошук користувача по id
  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return PrismaUserMapper.toDomain(user);
  }

  // оновлює інформацію про користувача
  async updateUser(userId: string, data: UpdateUserData): Promise<UserEntity> {
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
    isDeleted,
  }: FindAllUsersData): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      where: {
        ...(role !== undefined && { role }),
        ...(isBanned !== undefined && { isBanned }),
        ...(isDeleted !== undefined && { isDeleted }),
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
