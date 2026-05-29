import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';
import type { AuthRequest } from '../../../common/types/auth-request';
import { CreateGameUseCase } from '../application/create-game/create-game.ussecase';
import { PlayVideoSlotDto } from './dto/videoslot.dto';
import { PlaySpinUseCase } from '../application/play-spin/play-spin.usecase';
import { EndGameUseCase } from '../application/end-game/end-game.usecase';
import { CreateGameSwagger } from './swagger/create-game.swagger';
import { PlaySpinSwagger } from './swagger/play-spin.swagger';
import { EndGameSwagger } from './swagger/end-game.swagger';

@UseGuards(JwtAuthGuard)
@Controller('videoslot')
export class VideoslotController {
  constructor(
    private readonly createGameUseCase: CreateGameUseCase,
    private readonly playSpinUseCase: PlaySpinUseCase,
    private readonly endGameUseCase: EndGameUseCase,
  ) {}

  @CreateGameSwagger()
  @Post('start')
  async createGame(@Req() req: AuthRequest) {
    return await this.createGameUseCase.execute(req.user.id, 1);
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
}
