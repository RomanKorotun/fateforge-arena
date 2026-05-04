import { SessionEntity } from '../entities/session.entity';

export interface DeleteSessionData {
  sessionId: string;
  userId: string;
}

export interface ISessionRepository {
  // Створення/оновлення сесії з TTL (запис у Redis)
  set(key: string, value: SessionEntity, ttlSeconds: number): Promise<void>;

  // Додавання sessionId у множину сесій користувача (індексація)
  addSessionIndex(userId: string, sessionId: string): Promise<void>;

  // Отримання всіх активних сесій користувача (повні обʼєкти SessionEntity)
  getUserSessions(userId: string): Promise<SessionEntity[]>;

  // Отримання однієї сесії по ключу Redis (session:{id})
  getSession(sessionId: string): Promise<SessionEntity | null>;

  // Видалення конкретної сесії користувача (revoke session)
  deleteSession(data: DeleteSessionData): Promise<void>;

  // Видалення всіх сесій користувача
  deleteAllUserSessions(userId: string): Promise<void>;
}
