import { GameSession } from 'prisma/generated';
import { GameSessionEntity } from '../../../domain/entities/game-session.entity';

export class PrismaGameSessionMapper {
  static toDomain(gameSession: GameSession): GameSessionEntity {
    return new GameSessionEntity(
      gameSession.id,
      gameSession.userId,
      gameSession.serverSeed,
      gameSession.serverHash,
      gameSession.clientSeed,
      gameSession.nonce,
      gameSession.isActive,
      gameSession.createdAt,
    );
  }
}
