import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class GameSessionEntity {
  private nonce: number;

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly serverSeed: string,
    public readonly serverHash: string,
    public readonly clientSeed: string,
    nonce: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
  ) {
    this.nonce = nonce;
  }

  getNonce() {
    return this.nonce;
  }

  incrementNonce() {
    this.nonce++;
  }

ensureActive() {
  if (!this.isActive) {
    throw new DomainError('Session is closed', 403);
  }
}
  
  validateOwnership(userId: string): void {
    if (this.userId !== userId) {
      throw new DomainError('Not your session', 403);
    }
  }
}