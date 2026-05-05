import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';
import {
  CreateData,
  IGameSessionRepository,
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

  // пошук ігрової сесії по id користувача
  async findByUserId(userId: string): Promise<GameSessionEntity | null> {
    const session = await this.prisma.gameSession.findFirst({
      where: { userId },
    });

    if (!session) return null;

    return PrismaGameSessionMapper.toDomain(session);
  }
}
