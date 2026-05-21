import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../../../core/security/guards/jwt-auth.guard';
import { CreateDepositUseCase } from '../../application/create-deposit/create-deposit.use-case';
import { CreateDepositRequestDto } from '../dto/create-deposit/create-deposit-request.dto';
import type { AuthRequest } from '../../../../common/types/auth-request';
import { IdempotencyKey } from '../decorators/idempotency-key.decorator';
import { WithdrawUseCase } from '../../application/withdraw/withdraw.usecase';
import { CreateWithdrawRequestDto } from '../dto/create-withdraw/create-withdraw-request.dto';
import { IdempotencyKeyPipe } from '../pipes/idempotency-key.pipe';

import { WithdrawSwagger } from '../swagger/withdraw.swagger';
import { CreateDepositSwagger } from '../swagger/create-deposit.swagger';

@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly createDepositUseCase: CreateDepositUseCase,
    private readonly withdrawUseCase: WithdrawUseCase,
  ) {}

  @CreateDepositSwagger()
  @Post('create-deposit')
  async createDeposit(
    @Req() req: AuthRequest,
    @Body() dto: CreateDepositRequestDto,
    @IdempotencyKey() idempotencyKey: string,
  ) {
    return await this.createDepositUseCase.execute({
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
    @IdempotencyKey(IdempotencyKeyPipe)
    idempotencyKey: string,
  ) {
    return await this.withdrawUseCase.execute({
      ...dto,
      idempotencyKey,
      userId: req.user.id,
    });
  }
}
