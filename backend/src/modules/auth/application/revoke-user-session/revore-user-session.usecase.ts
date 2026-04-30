import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { RevokeUserSessionCommand } from './revore-user-session.command';
import type { ISessionRepository } from '../../domain/repositories/session.repository';
import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';

@Injectable()
export class RevokeUserSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  ) {}
  async execute(command: RevokeUserSessionCommand) {
    const { sessionId } = command;
    const sessionKey = `session:${sessionId}`;
    const session = await this.sessionRepository.getSession(sessionKey);
    if (!session) {
      throw new ForbiddenException()
    }
    await this.sessionRepository.deleteSession(command);
    return {
      sessionId: command.sessionId,
      status: 'revoked',
    };
  }
}
