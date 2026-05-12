import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import slugify from 'slugify';
import { randomUUID } from 'crypto';

import { TokenService } from '../../../../core/security/services/token.service';

import { JwtPayload } from '../../../../common/types/jwt-payload.type';
import { SESSION_TTL_SECONDS } from '../../../../common/constants/session.constants';
import { buildSessionKey } from '../../../../common/helpers/session-key.helper';
import { UNIT_OF_WORK } from '../../../../common/tokens/unit-of-work.token';
import type { IUnitOfWork } from '../../../../common/contracts/unit-of-work.interface';

import { AUTH_PROVIDER_REPOSITORY } from '../../domain/repositories/auth-provider.repository.token';
import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';
import type { IAuthProviderRepository } from '../../domain/repositories/auth-provider.repository';
import type { ISessionRepository } from '../../domain/repositories/session.repository';
import { AuthProviderEnum } from '../../domain/enums/auth-provider.enum';
import { SessionEntity } from '../../domain/entities/session.entity';

import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { PROFILE_REPOSITORY } from '../../../user/domain/repositories/profile.repository.token';
import type { IProfileRepository } from '../../../user/domain/repositories/profile.repository';

import { OAuthProfile, SigninOauthCommand } from './signin-oauth.command';

@Injectable()
export class SigninOauthUseCase {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(AUTH_PROVIDER_REPOSITORY)
    private readonly authProviderRepo: IAuthProviderRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepo: IProfileRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute({ oauthProfile, ip, device }: SigninOauthCommand) {
    // =========================================================
    // 1. USER + PROFILE + AVATAR + PROVIDER + EMAIL VERIFIED
    // =========================================================
    const user = await this.getOrCreateUser(oauthProfile);

    // =========================================================
    // 2. Перевірка стану акаунта
    // =========================================================
    // if (user.isDeleted) {
    //   throw new UnauthorizedException('ACCOUNT_DELETED');
    // }

    if (user.isDeleted) {
      await this.userRepo.updateUser(user.id, {
        isDeleted: false,
        deletedAt: null,
      });
    }

    if (user.isBanned) {
      throw new ForbiddenException('ACCOUNT_BLOCKED');
    }

    // =========================================================
    // 3. AUTH (JWT)
    // =========================================================
    const { accessToken, sessionId } = this.createAuth(user);

    // =========================================================
    // 4. SESSION
    // =========================================================
    await this.createSession(user, sessionId, ip, device);

    // =========================================================
    // 5. LAST LOGIN
    // =========================================================
    await this.updateLastLogin(user.id, ip);

    // =========================================================
    // 6. Відповідь в контролер
    // =========================================================
    return {
      accessToken,
      user: { username: user.username, email: user.email, role: user.role },
    };
  }

  // =========================================================
  // USER + PROFILE + AVATAR + PROVIDER + EMAIL VERIFIED
  // =========================================================
  private async getOrCreateUser(
    oauthProfile: OAuthProfile,
  ): Promise<UserEntity> {
    // =========================================================
    // 1. ШУКАЄМО OAuth provider
    // =========================================================
    // Перевіряємо: чи вже існує зв’язок:
    // Google account -> User
    // LinkedIn account -> User
    // Якщо існує - значить користувач вже логінився раніше через OAuth.
    const provider = await this.authProviderRepo.findByProviderAndProviderId({
      provider: oauthProfile.provider,
      providerId: oauthProfile.providerId,
    });

    // =========================================================
    // 2. КОРИСТУВАЧ ВЖЕ ПРИВ’ЯЗАНИЙ ДО OAuth
    // =========================================================
    if (provider) {
      // отримуємо user по userId
      const user = await this.userRepo.findById(provider.userId);

      // теоретично такого бути не повинно,але якщо provider є, а user нема — база в неконсистентному стані
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // повертаємо існуючого користувача
      return user;
    }

    // =========================================================
    // 3. ЗБЕРІГАЄМО ДАНІ OAuth ПРОВАЙДЕРА
    // =========================================================
    const providerType = oauthProfile.provider;
    const providerId = oauthProfile.providerId;

    // =========================================================
    // 4. ЯКЩО OAuth ПОВЕРНУВ EMAIL
    // =========================================================
    if (oauthProfile.email) {
      const email = oauthProfile.email;

      // =========================================================
      // 5. ШУКАЄМО ІСНУЮЧОГО USER ПО EMAIL
      // =========================================================
      // Це потрібно для сценарію:
      // 5.1. user зареєструвався через email/password
      // 5.2. потім логіниться через Google
      // Тоді ми НЕ створюємо нового user, а прив’язуємо OAuth account до існуючого користувача.
      const existing = await this.userRepo.findByEmail(email);

      // =========================================================
      // 6. USER ВЖЕ ІСНУЄ
      // =========================================================
      if (existing) {
        // =========================================================
        // TRANSACTION
        // =========================================================
        // Усе робимо в транзакції, щоб не було частково записаних даних.
        return this.unitOfWork.transaction(async (tx) => {
          // 6.1 ПРИВ’ЯЗУЄМО OAuth PROVIDER
          // Створюємо зв’язок: Google -> existing user
          // Щоб наступного разу login йшов через provider lookup,а не через email lookup.
          await this.authProviderRepo.create(
            { userId: existing.id, provider: providerType, providerId },
            tx,
          );

          // 6.2 ПІДТВЕРДЖУЄМО EMAIL
          // Якщо користувач логіниться через Google/LinkedIn, email вважається довіреним.
          // Тому автоматично верифікуємо email, якщо він ще не підтверджений.
          if (!existing.emailVerifiedAt) {
            await this.userRepo.updateUser(
              existing.id,
              { emailVerifiedAt: new Date() },
              tx,
            );
          }

          // 6.3 ОНОВЛЮЄМО AVATAR
          // Логіка:
          // - якщо avatar вже є -> НЕ перезаписуємо
          // - якщо avatar нема -> беремо з OAuth
          const profile = await this.profileRepo.findByUserId(existing.id, tx);

          if (profile && !profile.avatar && oauthProfile.avatar) {
            await this.profileRepo.updateAvatar(
              { userId: existing.id, avatar: oauthProfile.avatar },
              tx,
            );
          }

          // повертаємо існуючого user
          return existing;
        });
      }

      // =========================================================
      // 7. USER НЕ ІСНУЄ -> СТВОРЮЄМО НОВОГО
      // =========================================================
      return this.unitOfWork.transaction(async (tx) => {
        // 7.1 ГЕНЕРУЄМО USERNAME
        // John Doe -> john-doe-a1b2c3
        const username = this.generateUsername(oauthProfile);

        // 7.2 СТВОРЮЄМО USER
        const user = await this.userRepo.createUser({ username, email }, tx);

        // 7.3 СТВОРЮЄМО PROFILE
        await this.profileRepo.createProfile(user.id, tx);

        // 7.4 ЗБЕРІГАЄМО AVATAR
        // Якщо OAuth provider повернув avatar — записуємо його в profile.
        if (oauthProfile.avatar) {
          await this.profileRepo.updateAvatar(
            { userId: user.id, avatar: oauthProfile.avatar },
            tx,
          );
        }

        // 7.5 СТВОРЮЄМО OAuth PROVIDER
        // Прив’язуємо:
        // Google account -> user
        await this.authProviderRepo.create(
          { userId: user.id, provider: providerType, providerId },
          tx,
        );

        // 7.6 ВЕРИФІКУЄМО EMAIL
        // OAuth email вважається trusted, тому автоматично підтверджуємо його.
        await this.userRepo.updateUser(
          user.id,
          { emailVerifiedAt: new Date() },
          tx,
        );

        return user;
      });
    }

    // =========================================================
    // 8. FALLBACK — OAuth НЕ ПОВЕРНУВ EMAIL
    // =========================================================
    // Деякі провайдери можуть не повертати email.
    // Тоді створюємо технічний temp email.
    return this.unitOfWork.transaction(async (tx) => {
      // генеруємо username
      const username = this.generateUsername(oauthProfile);
      // temp email
      const email = `oauth_${providerId}@temp.local`;

      // 8.1 СТВОРЮЄМО USER
      const user = await this.userRepo.createUser({ username, email }, tx);

      // 8.2 СТВОРЮЄМО PROFILE
      await this.profileRepo.createProfile(user.id, tx);

      // 8.3 ЗБЕРІГАЄМО AVATAR
      if (oauthProfile.avatar) {
        await this.profileRepo.updateAvatar(
          { userId: user.id, avatar: oauthProfile.avatar },
          tx,
        );
      }

      // 8.4 ПРИВ’ЯЗУЄМО OAuth PROVIDER
      await this.authProviderRepo.create(
        { userId: user.id, provider: providerType, providerId },
        tx,
      );

      return user;
    });
  }

  // =========================================================
  // AUTH (JWT)
  // =========================================================
  private createAuth(user: UserEntity) {
    const sessionId = randomUUID();
    const payload: JwtPayload = { id: user.id, role: user.role, sessionId };
    const accessToken = this.tokenService.generate(payload);
    return { accessToken, sessionId };
  }

  // =========================================================
  // SESSION
  // =========================================================
  private async createSession(
    user: UserEntity,
    sessionId: string,
    ip: string,
    device: any,
  ) {
    const session: SessionEntity = {
      sessionId,
      userId: user.id,
      ip,
      device,
      createdAt: new Date().toISOString(),
    };

    const key = buildSessionKey(sessionId);
    await this.sessionRepository.set(key, session, SESSION_TTL_SECONDS);
    await this.sessionRepository.addSessionIndex(user.id, sessionId);
  }

  // =========================================================
  // LAST LOGIN
  // =========================================================
  private async updateLastLogin(userId: string, ip: string) {
    await this.userRepo.updateUser(userId, {
      lastLoginIP: ip,
      lastLoginAt: new Date(),
    });
  }

  // =========================================================
  // USERNAME
  // =========================================================
  private generateUsername(profile: OAuthProfile): string {
    const base = slugify(profile.name, { lower: true, strict: true });
    return `${base}-${profile.providerId.slice(0, 6)}`;
  }
}
