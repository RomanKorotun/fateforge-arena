import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../../../core/security/guards/jwt-auth.guard';
import type { AuthRequest } from '../../../../common/types/auth-request';
import { ParseUuidPipe } from '../../../../common/pipes/parse-uuid.pipe';

import { GetWalletUseCase } from '../../application/get-wallet/get-wallet.usecase';
import { GetUserWalletsSwagger } from '../swagger/get-user-wallets.swagger';

import { GetWalletSwagger } from '../swagger/get-wallet.swagger';
import { GetUserWalletsUseCase } from '../../application/get-user-wallets/get-user-wallets.usecase';

@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletController {
  constructor(
    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly getUserWalletsUseCase: GetUserWalletsUseCase,
  ) {}

  // ВСІ ГАМАНЦІ КОРИСТУВАЧА
  @GetUserWalletsSwagger()
  @Get('all')
  async getUserWallets(@Req() req: AuthRequest) {
    return this.getUserWalletsUseCase.execute(req.user.id);
  }

  // ОДИН ГАМАНЕЦЬ КОРИСТУВАЧА
  @GetWalletSwagger()
  @Get(':walletId')
  async getWallet(
    @Req() req: AuthRequest,
    @Param('walletId', ParseUuidPipe) walletId: string,
  ) {
    return this.getWalletUseCase.execute(walletId, req.user.id);
  }
}
