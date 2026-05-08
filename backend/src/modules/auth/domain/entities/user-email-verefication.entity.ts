export class UserEmailVerificationEntity {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private token: string,
    private expiresAt: Date,
    private usedAt: Date | null,
    private createdAt: Date,
  ) {}

  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  getExpiresAt() {
    return this.expiresAt;
  }

  getUsedAt() {
    return this.usedAt;
  }

  isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }

  isUsed(): boolean {
    return this.usedAt !== null;
  }

  use(): void {
    this.usedAt = new Date();
  }
}
