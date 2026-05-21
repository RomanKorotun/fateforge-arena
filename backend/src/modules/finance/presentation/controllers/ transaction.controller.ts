import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../../../core/security/guards/jwt-auth.guard';

import type { AuthRequest } from '../../../../common/types/auth-request';

import { GetTransactionsUseCase } from '../../application/get-transactions/get-transactions.usecase';

import { GetTransactionsQueryDto } from '../dto/get-transaction-query.dto';

import { GetTransactionsSwagger } from '../swagger/get-transaction.swagger';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
  ) {}

  @GetTransactionsSwagger()
  @Get()
  async getTransactions(
    @Req() req: AuthRequest,
    @Query() query: GetTransactionsQueryDto,
  ) {
    return this.getTransactionsUseCase.execute({
      requesterId: req.user.id,
      requesterRole: req.user.role,
      ...query,
    });
  }
}
