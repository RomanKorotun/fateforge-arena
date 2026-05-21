import { GameSessionEntity } from '../entities/game-session.entity';

export interface CreateData {
  userId: string;
  serverSeed: string;
  serverHash: string;
  clientSeed: string;
}

export interface UpdateGameSessionData {
  nonce?: number;
  isActive?: boolean;
  clientSeed?: string;
}

export interface IGameSessionRepository {
  create(data: CreateData): Promise<GameSessionEntity>;
  findById(id: string): Promise<GameSessionEntity | null>;
  findAllByUserId(userId: string): Promise<GameSessionEntity[]>;
  update(
    id: string,
    data: UpdateGameSessionData,
    tx?: unknown,
  ): Promise<GameSessionEntity>;
  findActiveByUserId(userId: string): Promise<GameSessionEntity | null>;
}
