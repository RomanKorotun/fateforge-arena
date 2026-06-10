import { BattleRoom } from '../entities/battle-room.entity';

/**
 * Redis storage для live battle state
 * Це оперативний стан бою (RAM/Redis)
 */
export interface BattleRepositoryInterface {
  // зберегти стан бою після кожного ходу
  save(room: BattleRoom): Promise<void>;

  // отримати бій по ID (для WS / reconnect)
  get(roomId: string): Promise<BattleRoom | null>;

  // видалити після FINISHED
  delete(roomId: string): Promise<void>;

  getAllActive(): Promise<BattleRoom[]>;
}
