import { Inject, Injectable } from '@nestjs/common';
import type { ISessionRepository } from '../../domain/repositories/session.repository';
import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';

@Injectable()
export class RevokeUserSessionsUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(userId: string) {
    await this.sessionRepository.deleteAllUserSessions(userId);
    return { status: 'revoked' };
  }
}
