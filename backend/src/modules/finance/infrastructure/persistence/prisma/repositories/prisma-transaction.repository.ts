import { Injectable } from '@nestjs/common';

import { PrismaTx } from '../../../../../../core/prisma/prisma.types';
import { PrismaService } from '../../../../../../core/prisma/prisma.service';

import type {
  CreateTransactionData,
  GetTransactionsParams,
  ITransactionRepository,
  UpdateTransactionStatusData,
} from '../../../../domain/repositories/transaction/transaction.repository';
import { PrismaTransactionMapper } from '../mappers/prisma-transaction.mapper';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: PrismaTx) {
    return tx ?? this.prisma;
  }

  // створення транзакції
  async createTransaction(data: CreateTransactionData, tx?: PrismaTx) {
    const client = this.getClient(tx);
    const transaction = await client.transaction.create({
      data: { ...data },
    });
    return PrismaTransactionMapper.toDomain(transaction);
  }

  // LOCK transaction row (FOR UPDATE)
  async lockByOrderId(orderId: string, tx?: PrismaTx) {
    const client = this.getClient(tx);

    const rows = await client.$queryRaw<any[]>`
    SELECT *
    FROM "finance"."transactions"
    WHERE "orderId" = ${orderId}
    FOR UPDATE
  `;

    if (!rows.length) return null;

    return PrismaTransactionMapper.toDomain(rows[0]);
  }

  // знайти по idempotency key
  async findByIdempotencyKey(key: string, tx?: PrismaTx) {
    const client = this.getClient(tx);
    const transaction = await client.transaction.findFirst({
      where: { idempotencyKey: key },
    });
    return transaction ? PrismaTransactionMapper.toDomain(transaction) : null;
  }

  // оновити статус
  async updateStatus(
    transactionId: string,
    data: UpdateTransactionStatusData,
    tx?: PrismaTx,
  ): Promise<void> {
    const client = this.getClient(tx);
    await client.transaction.update({
      where: { id: transactionId },
      data: {
        ...data,
        ...(data.providerPaymentId && {
          providerPaymentId: data.providerPaymentId,
        }),
      },
    });
  }

  // отримати список транзакцій
  async findMany(params: GetTransactionsParams, tx?: PrismaTx) {
    const client = this.getClient(tx);

    const {
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
    } = params;

    const skip = (page - 1) * limit;

    const where = {
      ...(userId && { wallet: { userId } }),
      ...(walletId && { walletId }),
      ...(type && { type }),
      ...(status && { status }),
      ...(provider && { provider }),
      ...(currency && { currency }),
      ...((from || to) && {
        createdAt: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
        },
      }),
    };

    const [transactions, total] = await Promise.all([
      client.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      client.transaction.count({ where }),
    ]);

    return {
      data: transactions.map(PrismaTransactionMapper.toDomain),
      total,
    };
  }
}
