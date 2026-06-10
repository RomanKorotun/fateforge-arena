import { DuelStatus } from '../enums/duel-status.enum';

export class DuelRequest {
  constructor(
    public id: string,
    public challengerId: string,
    public status: DuelStatus,
    public createdAt: string,
    public challengerUsername: string,
  ) {}
}
