import { GameSessionEntity } from '../../domain/entities/game-session.entity';

import { CreateGameSessionSuccessResponseDto } from '../dto/create-game-session/create-game-session-success-response.dto';

export class CreateGameSessionResponseMapper {
  static toDto(entity: GameSessionEntity): CreateGameSessionSuccessResponseDto {
    return {
      sessionId: entity.id,
      serverHash: entity.serverHash,
      clientSeed: entity.clientSeed,
    };
  }
}
