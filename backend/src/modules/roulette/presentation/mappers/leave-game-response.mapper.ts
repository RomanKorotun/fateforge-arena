import { GameSessionEntity } from '../../domain/entities/game-session.entity';
import { LeaveGameSuccessResponseDto } from '../dto/leave-game/leave-game-response-success.dto';

export class LeaveGameResponseMapper {
  static toDto(entity: GameSessionEntity): LeaveGameSuccessResponseDto {
    return {
      message: 'Session closed',
      sessionId: entity.id,
      isActive: entity.isActive,
      revealedServerSeed: entity.serverSeed,
    };
  }
}
