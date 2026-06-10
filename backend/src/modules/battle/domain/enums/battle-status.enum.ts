/**
 * Статус БОЮ (тільки battle room)
 */
export enum BattleStatus {
  WAITING = 'waiting', // чекає другого гравця

  ACTIVE = 'active', // бій іде

  FINISHED = 'finished', // бій завершено
}
