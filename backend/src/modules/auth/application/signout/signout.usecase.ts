import { Inject, Injectable } from '@nestjs/common';

import { SignoutCommand } from './signout.command';
import type { ISessionRepository } from '../../domain/repositories/session.repository';
import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';

@Injectable()
export class SignoutUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  ) {}
  async execute({ sessionId, userId }: SignoutCommand) {
    await this.sessionRepository.deleteSession({ sessionId, userId });
    return { message: 'Signout success' };
  }
}
