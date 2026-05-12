import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';

import { ParseUuidPipe } from '../../../common/pipes/parse-uuid.pipe';
import type { AuthRequest, AuthUser } from '../../../common/types/auth-request';

import { SignupRequestDto } from './dto/signup/signup-request.dto';
import { SigninRequestDto } from './dto/signin/signin.request.dto';
import { SignoutSuccessResponseDto } from './dto/signout/signout-success-response.dto';
import { RestoreUserRequestDto } from './dto/restore/restore-user.request.dto';
import { ResendEmailVerificationRequestDto } from './dto/resend-email-verification/resend-email-verification-request.dto';

import { CurrentUser } from './decorators/current-user.decorator';

import { AuthCookieService } from './services/auth-cookie-service';
import { RequestMetadataService } from './services/request-metadata.service';

import { SigninUseCase } from '../application/signin/signin.usecase';
import { SignupUseCase } from '../application/signup/signup.usecase';
import { RevokeUserSessionUseCase } from '../application/revoke-user-session/revore-user-session.usecase';
import { RevokeUserSessionsUseCase } from '../application/revoke-user-sessions/revoke-user-sessions.usecase';
import { FindSessionsByUserIdUseCase } from '../application/find-sessions-by-user-id/find-sessions-by-user-id.usecase';
import { SignoutUseCase } from '../application/signout/signout.usecase';
import { RestoreUserUseCase } from '../application/restore-user/restore-user.usecase';
import { ConfirmEmailUseCase } from '../application/confirm-email/confirm-email.usecase';
import { ResendEmailVerificationUseCase } from '../application/resend-email-verification/resend-email-verification.usecase';
import { SigninOauthUseCase } from '../application/signin-oauth/signin-oauth.usecase';

import { RestoreSwagger } from './swagger/restore.swagger';
import { GetUserSessionsSwagger } from './swagger/get-user-sessions.swagger';
import { RevokeUserSessionSwagger } from './swagger/revoke-user-session.swagger';
import { RevokeUserSessionsSwagger } from './swagger/revoke-user-sessions.swagger';
import { SignupSwagger } from './swagger/signup.swagger';
import { SigninSwagger } from './swagger/signin.swagger';
import { SignoutSwagger } from './swagger/signout.swagger';
import { MeSwagger } from './swagger/me.swagger';
import { ConfirmEmailSwagger } from './swagger/confirm-email.swagger';
import { ResendEmailVerificationSwagger } from './swagger/resend-email-verification.swagger';

import { GetUserSessionsResponseMapper } from './mappers/get-sessions-response.mapper';
import { MeResponseMapper } from './mappers/me-response.mapper';

import type { OAuthRequest } from './types/oauth-request.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly signinUseCase: SigninUseCase,
    private readonly requestMetadataService: RequestMetadataService,
    private readonly authCookieService: AuthCookieService,
    private readonly findSessionsByUserIdUseCase: FindSessionsByUserIdUseCase,
    private readonly revokeUserSessionUseCase: RevokeUserSessionUseCase,
    private readonly revokeUserSessionsUseCase: RevokeUserSessionsUseCase,
    private readonly signoutUseCase: SignoutUseCase,
    private readonly restoreUserUseCase: RestoreUserUseCase,
    private readonly confirmEmailUseCase: ConfirmEmailUseCase,
    private readonly resendEmailVerificationUseCase: ResendEmailVerificationUseCase,
    private readonly signinOauthUseCase: SigninOauthUseCase,
  ) {}

  // Редіректить користувача на Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  // Отримує profile від Google після успішної авторизації,
  // створює/логінить користувача
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: OAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { ip, device } = this.requestMetadataService.getMetadata(req);

    const { accessToken, user } = await this.signinOauthUseCase.execute({
      oauthProvider: req.user.provider,
      oauthProfile: req.user,
      ip,
      device,
    });

    this.authCookieService.setAuthCookie(res, accessToken);
    return user;
  }

  // Редіректить користувача на Linkedin
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  linkedinLogin() {}

  // Отримує profile від Linkedin після успішної авторизації,
  // створює/логінить користувача
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinCallback(
    @Req() req: OAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { ip, device } = this.requestMetadataService.getMetadata(req);
    const { accessToken, user } = await this.signinOauthUseCase.execute({
      oauthProvider: req.user.provider,
      oauthProfile: req.user,
      ip,
      device,
    });
    this.authCookieService.setAuthCookie(res, accessToken);
    return user;
  }

  // Редіректить користувача на Discord
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  discordLogin() {}

  // Отримує profile від Discord після успішної авторизації,
  // створює/логінить користувача
  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordCallback(
    @Req() req: OAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { ip, device } = this.requestMetadataService.getMetadata(req);
    const { accessToken, user } = await this.signinOauthUseCase.execute({
      oauthProvider: req.user.provider,
      oauthProfile: req.user,
      ip,
      device,
    });
    this.authCookieService.setAuthCookie(res, accessToken);
    return user;
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(
    @Req() req: OAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { ip, device } = this.requestMetadataService.getMetadata(req);
    const { accessToken, user } = await this.signinOauthUseCase.execute({
      oauthProvider: req.user.provider,
      oauthProfile: req.user,
      ip,
      device,
    });

    this.authCookieService.setAuthCookie(res, accessToken);
    return user;
  }

  // Реєстрація нового користувача
  @SignupSwagger()
  @Post('signup')
  async signup(@Body() dto: SignupRequestDto) {
    return await this.signupUseCase.execute(dto);
  }

  // Авторизація користувача: перевіряє дані, створює сесію та встановлює токен в кукі
  @SigninSwagger()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: SigninRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { ip, device } = this.requestMetadataService.getMetadata(req);
    const { accessToken, user } = await this.signinUseCase.execute({
      ...dto,
      ip,
      device,
    });
    this.authCookieService.setAuthCookie(res, accessToken);
    return user;
  }

  // відновлення видаленого акаунта користувача
  @RestoreSwagger()
  @HttpCode(HttpStatus.OK)
  @Post('restore')
  async restore(@Body() dto: RestoreUserRequestDto) {
    return await this.restoreUserUseCase.execute(dto);
  }

  // Отримати профіль поточного автентифікованого користувача
  @MeSwagger()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return MeResponseMapper.toResponse(user);
  }

  // Отримання всіх активних сесій поточного користувача (по userId з JWT)
  @GetUserSessionsSwagger()
  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  async getUserSessions(@Req() req: AuthRequest) {
    const sessions = await this.findSessionsByUserIdUseCase.execute(
      req.user.id,
    );
    return GetUserSessionsResponseMapper.toResponseList(
      sessions,
      req.user.sessionId,
    );
  }

  // Відкликання (revoke) конкретної сесії користувача
  @RevokeUserSessionSwagger()
  @UseGuards(JwtAuthGuard)
  @Delete('sessions/:id/revoke')
  async revokeUserSession(
    @Req() req: AuthRequest,
    @Param('id', new ParseUuidPipe()) id: string,
  ) {
    return await this.revokeUserSessionUseCase.execute({
      sessionId: id,
      userId: req.user.id,
    });
  }

  // Відкликання всіх активних сесій користувача
  @RevokeUserSessionsSwagger()
  @UseGuards(JwtAuthGuard)
  @Delete('sessions/revoke-all')
  async revokeUserSessions(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.revokeUserSessionsUseCase.execute(req.user.id);
    this.authCookieService.clearAuthCookie(res);
    return response;
  }

  // Завершення автентифікованої сесії
  @SignoutSwagger()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signout(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignoutSuccessResponseDto> {
    const response = await this.signoutUseCase.execute({
      sessionId: req.user.sessionId,
      userId: req.user.id,
    });
    this.authCookieService.clearAuthCookie(res);
    return response;
  }

  // підтвердження пошти
  @ConfirmEmailSwagger()
  @Get('confirm-email')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Query('token') token: string) {
    return await this.confirmEmailUseCase.execute(token);
  }

  // повторна відправка листа для підтвердження пошти
  @ResendEmailVerificationSwagger()
  @Post('email-verification/resend')
  @HttpCode(HttpStatus.OK)
  async resendEmailVerification(
    @Body() dto: ResendEmailVerificationRequestDto,
  ) {
    return await this.resendEmailVerificationUseCase.execute(dto.email);
  }
}
