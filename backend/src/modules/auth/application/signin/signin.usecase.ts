import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { SigninCommand } from './signin.command';
import { PasswordHashService } from '../../../../core/security/services/password-hash.service';
import { TokenService } from '../../../../core/security/services/token.service';
import type { ISessionRepository } from '../../domain/repositories/session.repository';
import { SESSION_TTL_SECONDS } from '../../../../common/constants/session.constants';
import { SessionEntity } from '../../domain/entities/session.entity';
import { JwtPayload } from '../../../../common/types/jwt-payload.type';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';
import { buildSessionKey } from '../../../../common/helpers/session-key.helper';

@Injectable()
export class SigninUseCase {
  constructor(
    private readonly passwordHashService: PasswordHashService,
    private readonly tokenService: TokenService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute({ email, password, ip, device }: SigninCommand) {
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordCompare = await this.passwordHashService.compare(
      password,
      user.password,
    );

    if (!passwordCompare) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('ACCOUNT_DELETED');
    }

    if (user.isBanned) {
      throw new ForbiddenException('ACCOUNT_BLOCKED');
    }

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException('EMAIL_NOT_VERIFIED');
    }
    
    const sessionId = randomUUID();

    const payload: JwtPayload = { id: user.id, role: user.role, sessionId };

    const accessToken = this.tokenService.generate(payload);

    const key = buildSessionKey(sessionId);

    const { browser, os, type } = device;

    const session: SessionEntity = {
      sessionId,
      userId: user.id,
      ip,
      device: { browser, os, type },
      createdAt: new Date().toISOString(),
    };

    await this.sessionRepository.set(key, session, SESSION_TTL_SECONDS);

    await this.sessionRepository.addSessionIndex(user.id, sessionId);

    await this.userRepository.updateUser(user.id, {
      lastLoginIP: ip,
      lastLoginAt: new Date(),
    });

    return {
      accessToken,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
