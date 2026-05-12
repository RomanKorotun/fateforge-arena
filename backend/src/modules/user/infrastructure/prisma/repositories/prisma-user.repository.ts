import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';

import type {
  CreateUserData,
  FindAllUsersData,
  IUserRepository,
  UpdateAvatar,
  UpdateUserData,
} from '../../../domain/repositories/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserEntityWithPassword } from '../../../domain/entities/user-with-password.type';

import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import { PrismaTx } from '../../../../../core/prisma/prisma.types';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: PrismaTx) {
    return tx ?? this.prisma;
  }

  // створення користувача
  async createUser(
    { username, email, password }: CreateUserData,
    tx?: PrismaTx,
  ): Promise<UserEntity> {
    const client = this.getClient(tx);
    const user = await client.user.create({
      data: { username, email, password },
    });
    return PrismaUserMapper.toDomain(user);
  }

  // пошук користувача по email разом
  async findByEmail(email: string, tx?: PrismaTx): Promise<UserEntity | null> {
    const client = this.getClient(tx);
    const user = await client.user.findUnique({
      where: { email },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  // пошук користувача по email разом із password hash
  async findByEmailWithPassword(
    email: string,
    tx?: PrismaTx,
  ): Promise<UserEntityWithPassword | null> {
    const client = this.getClient(tx);
    const user = await client.user.findUnique({
      where: { email },
    });
    return user ? PrismaUserMapper.toDomainWithPassword(user) : null;
  }

  // пошук користувача по id
  async findById(id: string, tx?: PrismaTx): Promise<UserEntity | null> {
    const client = this.getClient(tx);
    const user = await client.user.findUnique({
      where: { id },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  // оновлює інформацію про користувача
  async updateUser(
    userId: string,
    data: UpdateUserData,
    tx?: PrismaTx,
  ): Promise<UserEntity> {
    const client = this.getClient(tx);
    const user = await client.user.update({
      where: { id: userId },
      data,
    });
    return PrismaUserMapper.toDomain(user);
  }

  // отримати список всіх користувачів
  async findAllUsers(
    { skip, limit: take, role, isBanned, isDeleted }: FindAllUsersData,
    tx?: PrismaTx,
  ): Promise<UserEntity[]> {
    const client = this.getClient(tx);
    const users = await client.user.findMany({
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
}
