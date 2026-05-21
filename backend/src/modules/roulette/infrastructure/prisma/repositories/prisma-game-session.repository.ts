import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';
import {
  CreateData,
  IGameSessionRepository,
  UpdateGameSessionData,
} from '../../../domain/repositories/game-session.repository';
import { GameSessionEntity } from '../../../domain/entities/game-session.entity';

import { PrismaGameSessionMapper } from '../mappers/prisma-game-session.mapper';

import { PrismaTx } from '../../../../../core/prisma/prisma.types';

@Injectable()
export class PrismaGameSessionRepository implements IGameSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: PrismaTx) {
    return tx ?? this.prisma;
  }

  // створення ігрової сесії
  async create(data: CreateData): Promise<GameSessionEntity> {
    const gameSession = await this.prisma.gameSession.create({ data });
    return PrismaGameSessionMapper.toDomain(gameSession);
  }

  // пошук ігрової сесії по id сесії та по id користувача
  async findById(id: string): Promise<GameSessionEntity | null> {
    const session = await this.prisma.gameSession.findUnique({
      where: { id },
    });
    return session ? PrismaGameSessionMapper.toDomain(session) : null;
  }

  // список усіх ігрових сесій користувача
  async findAllByUserId(userId: string): Promise<GameSessionEntity[]> {
    const sessions = await this.prisma.gameSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return sessions.map((s) => PrismaGameSessionMapper.toDomain(s));
  }

  async update(
    id: string,
    data: UpdateGameSessionData,
    tx?: PrismaTx,
  ): Promise<GameSessionEntity> {
    const client = this.getClient(tx);
    const session = await client.gameSession.update({
      where: { id },
      data,
    });
    return PrismaGameSessionMapper.toDomain(session);
  }

  // отримати активні ігрові сесії
  async findActiveByUserId(userId: string): Promise<GameSessionEntity | null> {
    const session = await this.prisma.gameSession.findFirst({
      where: { userId, isActive: true },
    });

    return session ? PrismaGameSessionMapper.toDomain(session) : null;
  }
}
