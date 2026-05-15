import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { FinanceModule } from '../finance/finance.module';

import { PrismaModule } from '../../core/prisma/prisma.module';
import { EmailModule } from '../../core/email/email.module';
import { SecurityModule } from '../../core/security/security.module';
import { RedisModule } from '../../core/redis/redis.module';

import { AuthController } from './presentation/auth.controller';
import { RequestMetadataService } from './presentation/services/request-metadata.service';
import { AuthCookieService } from './presentation/services/auth-cookie-service';

import { SESSION_REPOSITORY } from './domain/repositories/session.repository.token';
import { USER_EMAIL_VERIFICATION_REPOSITORY } from './domain/repositories/user-email-verification.repository.token';
import { AUTH_PROVIDER_REPOSITORY } from './domain/repositories/auth-provider.repository.token';

import { DiscordStrategy } from './infrastructure/strategies/discord.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { PrismaUserEmailVerificationRepository } from './infrastructure/repositories/prisma/prisma-user-email-verification.repository';
import { RedisSessionRepository } from './infrastructure/repositories/redis/redis-session.repository';
import { FacebookStrategy } from './infrastructure/strategies/facebook.strategy';
import { GoogleStrategy } from './infrastructure/strategies/google.strategy';
import { PrismaAuthProviderRepository } from './infrastructure/repositories/prisma/auth-provider.repository';
import { LinkedinApi } from './infrastructure/oauth/ linkedin.api';
import { LinkedinStrategy } from './infrastructure/strategies/linkedin.strategy';

import { SignoutUseCase } from './application/signout/signout.usecase';
import { SignupUseCase } from './application/signup/signup.usecase';
import { SigninUseCase } from './application/signin/signin.usecase';
import { FindSessionsByUserIdUseCase } from './application/find-sessions-by-user-id/find-sessions-by-user-id.usecase';
import { RevokeUserSessionUseCase } from './application/revoke-user-session/revore-user-session.usecase';
import { RevokeUserSessionsUseCase } from './application/revoke-user-sessions/revoke-user-sessions.usecase';
import { RestoreUserUseCase } from './application/restore-user/restore-user.usecase';
import { ConfirmEmailUseCase } from './application/confirm-email/confirm-email.usecase';
import { ResendEmailVerificationUseCase } from './application/resend-email-verification/resend-email-verification.usecase';
import { SigninOauthUseCase } from './application/signin-oauth/signin-oauth.usecase';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [
    SecurityModule,
    DatabaseModule,
    PrismaModule,
    EmailModule,
    RedisModule,
    UserModule,
    FinanceModule,
  ],
  controllers: [AuthController],
  providers: [
    SignupUseCase,
    SigninUseCase,
    AuthCookieService,
    RequestMetadataService,
    JwtStrategy,
    DiscordStrategy,
    LinkedinStrategy,
    FacebookStrategy,
    GoogleStrategy,
    FindSessionsByUserIdUseCase,
    RevokeUserSessionUseCase,
    RevokeUserSessionsUseCase,
    SignoutUseCase,
    RestoreUserUseCase,
    ConfirmEmailUseCase,
    ResendEmailVerificationUseCase,
    SigninOauthUseCase,
    LinkedinApi,
    { provide: SESSION_REPOSITORY, useClass: RedisSessionRepository },
    {
      provide: USER_EMAIL_VERIFICATION_REPOSITORY,
      useClass: PrismaUserEmailVerificationRepository,
    },
    {
      provide: AUTH_PROVIDER_REPOSITORY,
      useClass: PrismaAuthProviderRepository,
    },
  ],
})
export class AuthModule {}
