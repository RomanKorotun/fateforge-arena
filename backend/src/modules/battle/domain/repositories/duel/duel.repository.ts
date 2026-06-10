import { DuelRequest } from '../../entities/duel-request.entity';

// Це заявки, не battle
export interface IDuelRepository {
  // створити заявку на бій
  save(duel: DuelRequest): Promise<void>;

  // отримати pending заявку по id користувача
  getByChallengerId(challengerId: string): Promise<DuelRequest | null>;

  // отримати одну заявку
  get(id: string): Promise<DuelRequest | null>;

  // видалити заявку
  delete(duel: DuelRequest): Promise<void>;

  // список всіх WAITING заявок
  getPending(): Promise<DuelRequest[]>;
}
