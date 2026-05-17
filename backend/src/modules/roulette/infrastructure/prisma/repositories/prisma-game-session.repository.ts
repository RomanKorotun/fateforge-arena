import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';
import {
  CreateData,
  IGameSessionRepository,
  UpdateGameSessionData,
} from '../../../domain/repositories/game-session.repository';
import { GameSessionEntity } from '../../../domain/entities/game-session.entity';

import { PrismaGameSessionMapper } from '../mappers/prisma-game-session.mapper';

@Injectable()
export class PrismaGameSessionRepository implements IGameSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async update(
    id: string,
    data: UpdateGameSessionData,
  ): Promise<GameSessionEntity> {
    const session = await this.prisma.gameSession.update({
      where: { id },
      data,
    });
    return PrismaGameSessionMapper.toDomain(session);
  }
}
