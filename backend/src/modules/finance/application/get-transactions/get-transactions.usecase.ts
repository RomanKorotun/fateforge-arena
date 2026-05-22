import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

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
    private readonly transactionRepository: ITransactionRepository,

    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(command: GetTransactionsCommand) {
    const {
      requesterId,
      requesterRole,
      userId,
      walletId,
      from,
      to,
      page,
      limit,
      ...filters
    } = command;

    // чи адмін
    const isAdmin = requesterRole === UserRole.ADMIN;

    const fromDate = from ? new Date(from + 'T00:00:00') : undefined;

    const toDate = to ? new Date(to + 'T23:59:59.999') : undefined;

    let finalUserId: string | undefined;
    let finalWalletId: string | undefined;

    // USER
    if (!isAdmin) {
      // USER не може
      // дивитися чужі транзакції

      if (userId && userId !== requesterId) {
        throw new ForbiddenException(
          'You cannot access other users transactions',
        );
      }

      // USER бачить
      // тільки свої транзакції

      finalUserId = requesterId;

      // якщо є walletId
      // перевіряємо що гаманець належить юзеру
      if (walletId) {
        const wallet = await this.walletRepository.findByIdAndUserId(
          walletId,
          requesterId,
        );

        if (!wallet) {
          throw new ForbiddenException('You cannot access this wallet');
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

    // ОТРИМАННЯ ТРАНЗАКЦІЙ
    const result = await this.transactionRepository.findMany({
      ...filters,
      userId: finalUserId,
      walletId: finalWalletId,
      from: fromDate,
      to: toDate,
      page,
      limit,
    });

    const transactions = result.data.map((transaction) => ({
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

    const totalPages = Math.max(1, Math.ceil(result.total / limit));

    return {
      data: transactions,
      pagination: {
        page,
        totalItems: result.total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
