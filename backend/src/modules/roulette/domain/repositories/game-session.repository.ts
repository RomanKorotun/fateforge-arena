import { GameSessionEntity } from '../entities/game-session.entity';

export interface CreateData {
  userId: string;
  serverSeed: string;
  serverHash: string;
  clientSeed: string;
}

export interface IGameSessionRepository {
  create(data: CreateData): Promise<GameSessionEntity>;
  findByUserId(userId: string): Promise<GameSessionEntity | null>;
}
