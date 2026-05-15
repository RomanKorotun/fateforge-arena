import { Module } from '@nestjs/common';

import { WalletController } from './presentation/controllers/wallet.controller';
import { PaymentController } from './presentation/controllers/payments.controller';
import { WALLET_REPOSITORY } from './domain/repositories/wallet.repository.token';
import { PrismaWalletRepository } from './infrastructure/persistence/prisma/repositories/prisma-wallet.repository';
import { CreateDepositUseCase } from './application/create-deposit/create-deposit.use-case';
import { LiqPayProvider } from './infrastructure/payment-providers/liqpay.provider';
import { PrismaTransactionRepository } from './infrastructure/persistence/prisma/repositories/prisma-transaction.repository';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction.repository.token';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { HandleDepositWebhookUseCase } from './application/handle-deposit-webhook/handle-deposit-webhook.use-case';
import { WayforpayProvider } from './infrastructure/payment-providers/way-for-pay.provider';
import { WayForPayWebhookController } from './presentation/webhooks/way-for-pay.webhook.controller';
import { WithdrawUseCase } from './application/withdraw/withdraw.usecase';
import { DepositUseCase } from './application/deposit/deposit.usecase';
import { GetWalletBalanceUseCase } from './application/get-wallet-balance/get-wallet-balance.usecase';
import { LiqPayWebhookController } from './presentation/webhooks/liqpay.webhook.controller';

@Module({
  imports: [PrismaModule, DatabaseModule],
  controllers: [
    WalletController,
    PaymentController,
    LiqPayWebhookController,
    WayForPayWebhookController,
  ],
  providers: [
    LiqPayProvider,
    WayforpayProvider,
    CreateDepositUseCase,
    WithdrawUseCase,
    DepositUseCase,
    GetWalletBalanceUseCase,
    HandleDepositWebhookUseCase,
    { provide: WALLET_REPOSITORY, useClass: PrismaWalletRepository },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [WALLET_REPOSITORY],
})
export class FinanceModule {}
