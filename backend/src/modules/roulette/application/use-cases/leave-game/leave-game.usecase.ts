import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session.repository.token';
import type { IGameSessionRepository } from '../../../domain/repositories/game-session.repository';

import { LeaveGameCommand } from './leave-game.command';

@Injectable()
export class LeaveGameUseCase {
  constructor(
    @Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
  ) {}

  async execute({ userId, sessionId }: LeaveGameCommand) {
    const session = await this.gameSessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('You have no access to this session');
    }

    if (!session.isActive) {
      return session;
    }

    const updateSession = await this.gameSessionRepository.update(sessionId, {
      isActive: false,
    });

    return updateSession;
  }
}
