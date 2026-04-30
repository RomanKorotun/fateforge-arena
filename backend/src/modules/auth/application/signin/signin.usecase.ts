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
import { UserRoleMapper } from '../../../user/application/mappers/user-role.mapper';
import { JwtPayload } from '../../../../common/types/jwt-payload.type';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';

@Injectable()
export class SigninUseCase {
  constructor(
    private readonly passwordHashService: PasswordHashService,
    private readonly tokenService: TokenService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(command: SigninCommand) {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new UnauthorizedException('Email або password не вірні');
    }

    const passwordCompare = await this.passwordHashService.compare(
      command.password,
      user.password,
    );

    if (!passwordCompare) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_DELETED',
        canRestore: true,
      });
    }

    if (user.isBanned) {
      throw new ForbiddenException({
        message: 'Користувач заблокований',
        code: 'ACCOUNT_BLOCKED',
      });
    }

    const sessionId = randomUUID();

    const payload: JwtPayload = {
      id: user.id,
      role: user.role,
      sessionId,
    };

    const accessToken = this.tokenService.generate(payload);

    const key = `session:${sessionId}`;

    const session: SessionEntity = {
      sessionId,
      userId: user.id,
      ip: command.ip,
      device: command.device,
      createdAt: new Date().toISOString(),
    };

    await this.sessionRepository.set(key, session, SESSION_TTL_SECONDS);

    await this.sessionRepository.addSessionIndex(user.id, sessionId);

   await this.userRepository.updateLastSignin({
      userId: user.id,
      ip: command.ip,
  });
    
    return {
      accessToken,
      user: {
        username: user.username,
        email: user.email,
        role: UserRoleMapper.toApi(user.role),
      },
    };
  }
}
