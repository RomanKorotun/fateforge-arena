import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { createPagination } from '../../../../common/helpers/pagination.helper';

import { UserRole } from '../../../user/domain/enums/user-role.enum';

import type { ITransactionRepository } from '../../domain/repositories/transaction/transaction.repository';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction/transaction.repository.token';
import type { IWalletRepository } from '../../domain/repositories/wallet/wallet.repository';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet/wallet.repository.token';

import { GetTransactionsCommand } from './get-transactions.command';

@Injectable()
export class GetTransactionsUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(command: GetTransactionsCommand) {
    const {
      requesterId,
      requesterRole,
      userId,
      walletId,
      type,
      status,
      provider,
      currency,
      from,
      to,
      page,
      limit,
    } = command;

    // чи адмін
    const isAdmin = requesterRole === UserRole.ADMIN;

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    let finalUserId: string | undefined;
    let finalWalletId: string | undefined;

    // USER
    if (!isAdmin) {
      // USER не може дивитися чужі транзакції

      if (userId && userId !== requesterId) {
        throw new ForbiddenException(
          'Доступ до транзакцій інших користувачів заборонено',
        );
      }

      // USER бачить тільки свої транзакції
      finalUserId = requesterId;

      // якщо є walletId перевіряємо що гаманець належить юзеру
      if (walletId) {
        const wallet = await this.walletRepo.findByIdAndUserId(
          walletId,
          requesterId,
        );

        if (!wallet) {
          throw new ForbiddenException('Доступ до цього гаманця заборонено');
        }

        finalWalletId = walletId;
      }
    }

    // ADMIN
    if (isAdmin) {
      // ADMIN може:
      // - дивитися будь-які транзакції
      // - фільтрувати по userId
      // - фільтрувати по walletId

      finalUserId = userId;
      finalWalletId = walletId;
    }

    // отримання транзакцій
    const { data, total } = await this.transactionRepo.findMany({
      userId: finalUserId,
      walletId: finalWalletId,
      type,
      status,
      provider,
      currency,
      from: fromDate,
      to: toDate,
      page,
      limit,
    });

    const transactions = data.map((transaction) => ({
      id: transaction.id,
      walletId: transaction.walletId,
      type: transaction.type,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      provider: transaction.provider,
      description: transaction.description,
      createdAt: transaction.createdAt,
    }));

    const pagination = createPagination({ page, limit, totalItems: total });

    return { transactions, pagination };
  }
}
