import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';
import type { ISessionRepository } from '../../domain/repositories/session.repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import { JwtPayload } from '../../../../common/types/jwt-payload.type';
import type { IUserRepository } from '../../../../modules/user/domain/repositories/user.repository';

@Injectable()
export class ValidateUserService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async validateByPayload(payload: JwtPayload) {
    const session = await this.sessionRepository.getSession(payload.sessionId);

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('ACCOUNT_DELETED');
    }

    if (user.isBanned) {
      throw new ForbiddenException('ACCOUNT_BLOCKED');
    }

    return user;
  }
}
