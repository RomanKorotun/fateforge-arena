import { Module } from '@nestjs/common';

import { AuthController } from './presentation/auth.controller';
import { UserModule } from '../user/user.module';
import { SignupUseCase } from './application/signup/signup.usecase';
import { SecurityModule } from '../../core/security/security.module';
import { SigninUseCase } from './application/signin/signin.usecase';
import { RedisModule } from '../../core/redis/redis.module';
import { RequestMetadataService } from './presentation/services/request-metadata.service';
import { RedisSessionRepository } from './infrastructure/repositories/redis/redis-session.repository';
import { AuthCookieService } from './presentation/services/auth-cookie-service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { FindSessionsByUserIdUseCase } from './application/find-sessions-by-user-id/find-sessions-by-user-id.usecase';
import { RevokeUserSessionUseCase } from './application/revoke-user-session/revore-user-session.usecase';
import { RevokeUserSessionsUseCase } from './application/revoke-user-sessions/revoke-user-sessions';
import { SignoutUseCase } from './application/signout/signout.usecase';
import { SESSION_REPOSITORY } from './domain/repositories/session.repository.token';
import { RestoreUserUseCase } from './application/restore-user/restore-user.usecase';

@Module({
  imports: [SecurityModule, RedisModule, UserModule],
  controllers: [AuthController],
  providers: [
    SignupUseCase,
    SigninUseCase,
    AuthCookieService,
    RequestMetadataService,
    JwtStrategy,
    FindSessionsByUserIdUseCase,
    RevokeUserSessionUseCase,
    RevokeUserSessionsUseCase,
    SignoutUseCase,
    RestoreUserUseCase,
    { provide: SESSION_REPOSITORY, useClass: RedisSessionRepository },
  ],
})
export class AuthModule {}
