import { BattleRoom } from '../../entities/battle-room.entity';

export interface IBattleRepository {
  // зберегти стан бою після кожного ходу
  save(room: BattleRoom): Promise<void>;

  // отримати бій по ID
  get(roomId: string): Promise<BattleRoom | null>;

  // видалити після FINISHED
  delete(roomId: string): Promise<void>;

  // ьотмаи всі бої
  getAllActive(): Promise<BattleRoom[]>;
}
