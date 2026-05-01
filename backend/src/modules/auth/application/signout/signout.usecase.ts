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
  async execute(command: SignoutCommand) {
    await this.sessionRepository.deleteSession(command);
    return { message: 'Signout success' };
  }
}
