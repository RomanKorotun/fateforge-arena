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
import { RevokeUserSessionsUseCase } from './application/revoke-user-sessions/revoke-user-sessions.usecase';
import { SignoutUseCase } from './application/signout/signout.usecase';
import { SESSION_REPOSITORY } from './domain/repositories/session.repository.token';
import { RestoreUserUseCase } from './application/restore-user/restore-user.usecase';
import { ConfirmEmailUseCase } from './application/confirm-email/confirm-email.usecase';
import { USER_EMAIL_VERIFICATION_REPOSITORY } from './domain/repositories/user-email-verification.repository.token';
import { PrismaUserEmailVerificationRepository } from './infrastructure/repositories/prisma/prisma-user-email-verification.repository';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { EmailModule } from '../../core/email/email.module';
import { ResendEmailVerificationUseCase } from './application/resend-email-verification/resend-email-verification.usecase';

@Module({
  imports: [SecurityModule, PrismaModule, EmailModule, RedisModule, UserModule],
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
    ConfirmEmailUseCase,
    ResendEmailVerificationUseCase,
    { provide: SESSION_REPOSITORY, useClass: RedisSessionRepository },
    {
      provide: USER_EMAIL_VERIFICATION_REPOSITORY,
      useClass: PrismaUserEmailVerificationRepository,
    },
  ],
})
export class AuthModule {}
