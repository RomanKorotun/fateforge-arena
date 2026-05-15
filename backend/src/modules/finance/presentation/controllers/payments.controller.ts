import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../../../core/security/guards/jwt-auth.guard';
import { CreateDepositUseCase } from '../../application/create-deposit/create-deposit.use-case';
import { CreateDepositRequestDto } from '../dto/create-deposit/create-deposit-request.dto';
import type { AuthRequest } from '../../../../common/types/auth-request';
import { IdempotencyKey } from '../decorators/idempotency-key.decorator';
import { DepositUseCase } from '../../application/deposit/deposit.usecase';
import { WithdrawUseCase } from '../../application/withdraw/withdraw.usecase';
import { CreateWithdrawRequestDto } from '../dto/create-withdraw/create-withdraw-request.dto';
import { DepositSwagger } from '../swagger/deposit.swagger';
import { WithdrawSwagger } from '../swagger/withdraw.swagger';

@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly createDepositUseCase: CreateDepositUseCase,
    private readonly depositUseCase: DepositUseCase,
    private readonly withdrawUseCase: WithdrawUseCase,
  ) {}

  // @Post('create-deposit')
  // async createDeposit(
  //   @Req() req: AuthRequest,
  //   @Body() dto: CreateDepositRequestDto,
  //   @IdempotencyKey() idempotencyKey: string,
  // ) {
  //   return await this.createDepositUseCase.execute({
  //     ...dto,
  //     idempotencyKey,
  //     userId: req.user.id,
  //   });
  // }

  @DepositSwagger()
  @Post('deposit')
  async Deposit(
    @Req() req: AuthRequest,
    @Body() dto: CreateDepositRequestDto,
    @IdempotencyKey() idempotencyKey: string,
  ) {
    return await this.depositUseCase.execute({
      ...dto,
      idempotencyKey,
      userId: req.user.id,
    });
  }

  @WithdrawSwagger()
  @Post('withdraw')
  async withdraw(
    @Req() req: AuthRequest,
    @Body() dto: CreateWithdrawRequestDto,
    @IdempotencyKey() idempotencyKey: string,
  ) {
    return await this.withdrawUseCase.execute({
      ...dto,
      idempotencyKey,
      userId: req.user.id,
    });
  }
}
