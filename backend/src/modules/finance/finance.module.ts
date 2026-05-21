import { Module } from '@nestjs/common';

import { WalletController } from './presentation/controllers/wallet.controller';
import { PaymentController } from './presentation/controllers/payments.controller';
import { WALLET_REPOSITORY } from './domain/repositories/wallet/wallet.repository.token';
import { PrismaWalletRepository } from './infrastructure/persistence/prisma/repositories/prisma-wallet.repository';
import { CreateDepositUseCase } from './application/create-deposit/create-deposit.use-case';
import { PrismaTransactionRepository } from './infrastructure/persistence/prisma/repositories/prisma-transaction.repository';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction/transaction.repository.token';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { HandleDepositWebhookUseCase } from './application/handle-deposit-webhook/handle-deposit-webhook.use-case';
import { WithdrawUseCase } from './application/withdraw/withdraw.usecase';
import { GetWalletUseCase } from './application/get-wallet/get-wallet.usecase';
import { GetUserWalletsUseCase } from './application/get-user-wallets/get-user-wallets.usecase';
import { StripeWebhookController } from './presentation/webhooks/stripe-webhook.controller';
import { StripeProvider } from './infrastructure/payment-providers/stripe.provider';
import { GetTransactionsUseCase } from './application/get-transactions/get-transactions.usecase';
import { TransactionController } from './presentation/controllers/ transaction.controller';

@Module({
  imports: [PrismaModule, DatabaseModule],
  controllers: [
    WalletController,
    PaymentController,
    TransactionController,
    StripeWebhookController,
  ],
  providers: [
    StripeProvider,
    CreateDepositUseCase,
    WithdrawUseCase,
    GetWalletUseCase,
    GetUserWalletsUseCase,
    HandleDepositWebhookUseCase,
    GetTransactionsUseCase,
    { provide: WALLET_REPOSITORY, useClass: PrismaWalletRepository },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [WALLET_REPOSITORY, TRANSACTION_REPOSITORY],
})
export class FinanceModule {}
