import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { CreateGameSessionUseCase } from '../application/use-cases/create-game-session/create-game-session.usecase';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';
import type { AuthRequest } from '../../../common/types/auth-request';
import { PlaceBetDto } from './dto/place-bet/place-bet-request.dto';
import { PlaceBetUseCase } from '../application/use-cases/place-bet/place-bet.usecase';

@Controller('roulette')
export class RouletteController {
  constructor(
    private readonly createSessionUseCase: CreateGameSessionUseCase,
    private readonly placeBetUseCase: PlaceBetUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('join')
  async join(@Req() req: AuthRequest) {
    return await this.createSessionUseCase.execute(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bet')
  async placeBet(@Req() req: AuthRequest, @Body() dto: PlaceBetDto) {
    return await this.placeBetUseCase.execute(req.user.id, dto);
  }
}
