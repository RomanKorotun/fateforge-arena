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

import { PlaceBetResponseMapper } from './mappers/place-bet-response.mapper';
import { GetHistoryGameResponseMapper } from './mappers/get-history-game-response.mapper';
import { LeaveGameResponseMapper } from './mappers/leave-game-response.mapper';
import { CreateGameSessionResponseMapper } from './mappers/create-game-session-response.mapper';

@Controller('roulette')
export class RouletteController {
  constructor(
    private readonly createSessionUseCase: CreateGameSessionUseCase,
    private readonly placeBetUseCase: PlaceBetUseCase,
    private readonly getHistoryGameUseCase: GetHistoryGameUseCase,
    private readonly leaveGameUseCase: LeaveGameUseCase,
  ) {}

  // Створює нову ігрову сесію для користувача.
  @CreateGameSessionSwagger()
  @UseGuards(JwtAuthGuard)
  @Post('join')
  async join(
    @Req() req: AuthRequest,
  ): Promise<CreateGameSessionSuccessResponseDto> {
    const gameSession = await this.createSessionUseCase.execute(req.user.id);
    return CreateGameSessionResponseMapper.toDto(gameSession);
  }

  // Обробляє ставки користувача в межах активної ігрової сесії.
  // Виконує розрахунок результату спіну (win number), визначає виграші, рахує payout та повертає підсумок раунду (profit, total bet, results по кожній ставці).
  @PlaceBetSwagger()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistoryGame(
    @Req() req: AuthRequest,
    @Query() query: GetHistoryGameQueryDto,
  ): Promise<GetHistoryGameSuccessResponseDto[]> {
    const bets = await this.getHistoryGameUseCase.execute({
      userId: req.user.id,
      query,
    });
    return GetHistoryGameResponseMapper.toDtoList(bets);
  }

  // Завершує активну ігрову сесію користувача.
  // Після виклику сесія більше не приймає ставки.
  @LeaveGameSwagger()
  @UseGuards(JwtAuthGuard)
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
