import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { JwtAuthGuard } from '../../../../core/security/guards/jwt-auth.guard';

import type { AuthRequest } from '../../../../common/types/auth-request';

import { PlayVideoSlotDto } from '../dto/videoslot.dto';
import { GetVideoslotHistoryQueryDto } from '../dto/get-videoslot-history-query.dto';
import { CreateGameRequestDto } from '../dto/create-game-request.dto';

import { PlaySpinUseCase } from '../../application/use-case/play-spin/play-spin.usecase';
import { EndGameUseCase } from '../../application/use-case/end-game/end-game.usecase';
import { GetCurrentGameUseCase } from '../../application/use-case/get-current-videoslot-session/get-current-game.usecase';
import { CreateGameUseCase } from '../../application/use-case/create-game/create-game.ussecase';
import { GetVideoslotHistoryUseCase } from '../../application/use-case/get-videoslot-history/get-videoslot-history.usecase';

import { CreateGameSwagger } from '../swagger/create-game.swagger';
import { PlaySpinSwagger } from '../swagger/play-spin.swagger';
import { EndGameSwagger } from '../swagger/end-game.swagger';
import { GetVideoslotHistorySwagger } from '../swagger/get-videoslot-history.swagger';

@UseGuards(JwtAuthGuard)
@Controller('videoslot')
export class VideoslotController {
  constructor(
    private readonly createGameUseCase: CreateGameUseCase,
    private readonly playSpinUseCase: PlaySpinUseCase,
    private readonly endGameUseCase: EndGameUseCase,
    private readonly GetCurrentGameUseCase: GetCurrentGameUseCase,
    private readonly getVideoslotHistoryUseCase: GetVideoslotHistoryUseCase,
  ) {}

  @CreateGameSwagger()
  @Post('start')
  async createGame(@Req() req: AuthRequest, @Body() dto: CreateGameRequestDto) {
    return await this.createGameUseCase.execute({
      userId: req.user.id,
      mode: 1,
      walletId: dto.walletId,
    });
  }

  @Get('current-session')
  async getCurrentSession(@Req() req: AuthRequest, @Res() res: Response) {
    const currentGame = await this.GetCurrentGameUseCase.execute(req.user.id);
    return res.json(currentGame);
  }

  @PlaySpinSwagger()
  @Post('play-spin')
  async playSpin(@Req() req: AuthRequest, @Body() dto: PlayVideoSlotDto) {
    return await this.playSpinUseCase.execute({
      userId: req.user.id,
      data: dto,
    });
  }

  @EndGameSwagger()
  @Delete(':gameId')
  async endGame(@Req() req: AuthRequest, @Param('gameId') gameId: string) {
    const userId = req.user.id;
    return this.endGameUseCase.execute(userId, gameId);
  }

  @GetVideoslotHistorySwagger()
  @Get('history')
  async getHistory(
    @Req() req: AuthRequest,
    @Query() query: GetVideoslotHistoryQueryDto,
  ) {
    return this.getVideoslotHistoryUseCase.execute({
      requesterId: req.user.id,
      requesterRole: req.user.role,
      ...query,
    });
  }
}
