import { GameSession } from '../../entities/game-session.entity';

export interface IGameSessionRepository {
  save(userId: string, session: GameSession): Promise<void>;
  get(userId: string): Promise<GameSession | null>;
  delete(userId: string): Promise<void>;
}
