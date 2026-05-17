import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../../../core/security/guards/jwt-auth.guard';
import type { AuthRequest } from '../../../../common/types/auth-request';

import { GetWalletBalanceUseCase } from '../../application/get-wallet-balance/get-wallet-balance.usecase';
import { GetBalanceSwagger } from '../swagger/get-balance.swagger';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly getWalletBalanceUseCase: GetWalletBalanceUseCase,
  ) {}

  @GetBalanceSwagger()
  @Get('balance/:walletId')
  async getBalance(
    @Req() req: AuthRequest,
    @Param('walletId') walletId: string,
  ) {
    return this.getWalletBalanceUseCase.execute(walletId, req.user.id);
  }
}
