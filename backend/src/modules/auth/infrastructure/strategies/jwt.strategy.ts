import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { JwtPayload } from '../../../../common/types/jwt-payload.type';

import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';

import type { ISessionRepository } from '../../domain/repositories/session.repository';
import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: (req) => req?.cookies?.accessToken,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { id, sessionId } = payload;

    const session = await this.sessionRepository.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('ACCOUNT_DELETED');
    }

    if (user.isBanned) {
      throw new ForbiddenException('ACCOUNT_BLOCKED');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      sessionId,
    };
  }
}
