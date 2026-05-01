import { Inject, Injectable } from '@nestjs/common';

import type { ISessionRepository } from '../../domain/repositories/session.repository';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';

@Injectable()
export class FindSessionsByUserIdUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(userId: string): Promise<SessionEntity[]> {
    return this.sessionRepository.getUserSessions(userId);
  }
}
