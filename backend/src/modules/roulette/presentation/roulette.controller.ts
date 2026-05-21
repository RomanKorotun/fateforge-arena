import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';

import { ParseUuidPipe } from '../../../common/pipes/parse-uuid.pipe';
import type { AuthRequest } from '../../../common/types/auth-request';

import { CreateGameSessionUseCase } from '../application/use-cases/create-game-session/create-game-session.usecase';
import { GetHistoryGameUseCase } from '../application/use-cases/get-history-game/get-history-game.usecase';
import { PlaceBetUseCase } from '../application/use-cases/place-bet/place-bet.usecase';
import { LeaveGameUseCase } from '../application/use-cases/leave-game/leave-game.usecase';
import { GetUserAllGameSessionsUseCase } from '../application/use-cases/get-user-all-game-sessions/get-user-all-game-sessions.usecase';

import { PlaceBetRequestDto } from './dto/place-bet/place-bet-request.dto';
import { GetHistoryGameQueryDto } from './dto/get-history-game.query.dto';
import { LeaveGameSuccessResponseDto } from './dto/leave-game/leave-game-response-success.dto';
import { PlaceBetSuccessResponseDto } from './dto/place-bet/place-bet-success-response.dto';
import { CreateGameSessionSuccessResponseDto } from './dto/create-game-session/create-game-session-success-response.dto';
import { GetHistoryGameSuccessResponseDto } from './dto/get-history-game/get-history-game-success-response.dto';

import { LeaveGameSwagger } from './swagger/leave-game.swagger';
import { GetHistoryGameSwagger } from './swagger/get-history-game.swagger';
import { PlaceBetSwagger } from './swagger/place-bet.swagger';
import { CreateGameSessionSwagger } from './swagger/create-game-session.swagger';
import { GetUserSessionsSwagger } from './swagger/get-user-all-game-sessions.swagger';

import { PlaceBetResponseMapper } from './mappers/place-bet-response.mapper';
import { GetHistoryGameResponseMapper } from './mappers/get-history-game-response.mapper';
import { LeaveGameResponseMapper } from './mappers/leave-game-response.mapper';
import { CreateGameSessionResponseMapper } from './mappers/create-game-session-response.mapper';

@UseGuards(JwtAuthGuard)
@Controller('roulette')
export class RouletteController {
  constructor(
    private readonly createSessionUseCase: CreateGameSessionUseCase,
    private readonly placeBetUseCase: PlaceBetUseCase,
    private readonly getHistoryGameUseCase: GetHistoryGameUseCase,
    private readonly leaveGameUseCase: LeaveGameUseCase,
    private readonly getUserAllGameSessionsUseCase: GetUserAllGameSessionsUseCase,
  ) {}

  // Створює нову ігрову сесію для користувача.
  @CreateGameSessionSwagger()
  @Post('join')
  async join(
    @Req() req: AuthRequest,
  ): Promise<CreateGameSessionSuccessResponseDto> {
    const gameSession = await this.createSessionUseCase.execute(req.user.id);
    return CreateGameSessionResponseMapper.toDto(gameSession);
  }

  // Повертає список ігрових сесій користувача
  @GetUserSessionsSwagger()
  @Get('sessions')
  async getUserAllGameSessions(@Req() req: AuthRequest) {
    return await this.getUserAllGameSessionsUseCase.execute(req.user.id);
  }

  // Обробляє ставки користувача в межах активної ігрової сесії.
  // Виконує розрахунок результату спіну (win number), визначає виграші, рахує payout та повертає підсумок раунду (profit, total bet, results по кожній ставці).
  @PlaceBetSwagger()
  @Post('bet')
  async placeBet(
    @Req() req: AuthRequest,
    @Body() dto: PlaceBetRequestDto,
  ): Promise<PlaceBetSuccessResponseDto> {
    const placeBet = await this.placeBetUseCase.execute({
      userId: req.user.id,
      dto,
    });
    return PlaceBetResponseMapper.toDto(placeBet);
  }

  // Повертає історію ставок користувача.
  // Підтримує пагінацію та фільтрацію по gameSessionId.
  @GetHistoryGameSwagger()
  @Get('history')
  async getHistoryGame(
    @Req() req: AuthRequest,
    @Query() query: GetHistoryGameQueryDto,
  ) {
    const result = await this.getHistoryGameUseCase.execute({
      requesterId: req.user.id,
      requesterRole: req.user.role,
      ...query,
    });

    return result;
  }

  // Завершує активну ігрову сесію користувача.
  // Після виклику сесія більше не приймає ставки.
  @LeaveGameSwagger()
  @Patch('leave/:id')
  async leaveGame(
    @Req() req: AuthRequest,
    @Param('id', new ParseUuidPipe()) sessionId: string,
  ): Promise<LeaveGameSuccessResponseDto> {
    const result = await this.leaveGameUseCase.execute({
      userId: req.user.id,
      sessionId,
    });
    return LeaveGameResponseMapper.toDto(result);
  }
}
