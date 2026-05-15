import { Injectable } from '@nestjs/common';

import { PrismaTx } from '../../../../../../core/prisma/prisma.types';
import { PrismaService } from '../../../../../../core/prisma/prisma.service';

import type {
  CreateTransactionData,
  ITransactionRepository,
} from '../../../../domain/repositories/transaction.repository';
import { PrismaTransactionMapper } from '../mappers/prisma-transaction.mapper';
import { TransactionStatus } from '../../../../domain/enums/transaction-status.enum';

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
    FROM transactions
    WHERE "orderId" = ${orderId}
    FOR UPDATE
  `;

    if (!rows.length) return null;

    return PrismaTransactionMapper.toDomain(rows[0]);
  }

  // знайти по idempotency key
  async findByIdempotencyKey(key: string, tx?: PrismaTx) {
    const client = this.getClient(tx);
    const transaction = await client.transaction.findUnique({
      where: { idempotencyKey: key },
    });
    return transaction ? PrismaTransactionMapper.toDomain(transaction) : null;
  }

  // оновити статус
  async updateStatus(
    transactionId: string,
    data: {
      status: TransactionStatus;
      providerPaymentId?: string;
    },
    tx?: PrismaTx,
  ): Promise<void> {
    const client = this.getClient(tx);
    await client.transaction.update({
      where: { id: transactionId },
      data: {
        status: data.status,
        ...(data.providerPaymentId && {
          providerPaymentId: data.providerPaymentId,
        }),
      },
    });
  }
}
