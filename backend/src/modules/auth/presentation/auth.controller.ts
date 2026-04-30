import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { SignupUseCase } from '../application/signup/signup.usecase';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { SigninUseCase } from '../application/signin/signin.usecase';
import { RequestMetadataService } from './services/request-metadata.service';
import { AuthCookieService } from './services/auth-cookie-service';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthRequest, AuthUser } from '../../../common/types/auth-request';
import { MeResponseMapper } from './mappers/me-response.mapper';
import { FindSessionsByUserIdUseCase } from '../application/find-sessions-by-user-id/find-sessions-by-user-id.usecase';
import { GetUserSessionsResponseMapper } from './mappers/get-sessions-response.mapper';
import { RevokeUserSessionUseCase } from '../application/revoke-user-session/revore-user-session.usecase';
import { RevokeUserSessionsUseCase } from '../application/revoke-user-sessions/revoke-user-sessions';
import { SignoutUseCase } from '../application/signout/signout.usecase';
import { RestoreUserDto } from './dto/restore-user.dto';
import { RestoreUserUseCase } from '../application/restore-user/restore-user.usecase';

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
  ) {}

  // Реєстрація нового користувача
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.signupUseCase.execute(dto);
  }

  // Авторизація користувача: перевіряє дані, створює сесію та встановлює токен в кукі
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: SigninDto,
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
  @Post('restore')
  async restore(@Body() dto: RestoreUserDto) {
    return this.restoreUserUseCase.execute(dto);
  }

  // Отримати профіль поточного автентифікованого користувача
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return MeResponseMapper.toResponse(user);
  }

  // Отримання всіх активних сесій поточного користувача (по userId з JWT)
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
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('sessions/:id/revoke')
  async revokeUserSession(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.revokeUserSessionUseCase.execute({
      sessionId: id,
      userId: req.user.id,
    });
  }

  // Відкликання всіх активних сесій користувача
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
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signout(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.signoutUseCase.execute({
      sessionId: req.user.sessionId,
      userId: req.user.id,
    });
    this.authCookieService.clearAuthCookie(res);
    return response;
  }
}
