import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../core/prisma/prisma.service';
import { WalletEntity } from '../../../../domain/entities/wallet.entity';
import {
  CreateWalletData,
  IWalletRepository,
} from '../../../../domain/repositories/wallet.repository';
import { PrismaTx } from '../../../../../../core/prisma/prisma.types';
import { PrismaWalletMapper } from '../mappers/prisma-wallet.mapper';

@Injectable()
export class PrismaWalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: PrismaTx) {
    return tx ?? this.prisma;
  }

  // Створити гаманець для юзера
  async createWallet({ userId, currency }: CreateWalletData, tx?: PrismaTx) {
    const client = this.getClient(tx);
    const wallet = await client.wallet.create({
      data: { userId, ...(currency && { currency }) },
    });
    return PrismaWalletMapper.toDomain(wallet);
  }

  // Знайти гаманець по id гаманця і по userId
  async findByIdAndUserId(walletId: string, userId: string, tx?: PrismaTx) {
    const client = this.getClient(tx);
    const wallet = await client.wallet.findFirst({
      where: { id: walletId, userId },
    });
    return wallet ? PrismaWalletMapper.toDomain(wallet) : null;
  }

  // Збільшити баланс (депозит / win)
  async increaseBalance(walletId: string, amount: number, tx?: PrismaTx) {
    const client = tx ?? this.prisma;
    await client.wallet.update({
      where: { id: walletId },
      data: { balance: { increment: amount } },
    });
  }

  // Зменшити баланс (withdraw / bet)
  async decreaseBalance(walletId: string, amount: number, tx?: PrismaTx) {
    const client = tx ?? this.prisma;
    await client.wallet.update({
      where: { id: walletId },
      data: { balance: { decrement: amount } },
    });
  }

  async lockById(walletId: string, tx?: PrismaTx) {
    const client = this.getClient(tx);
    const rows = await client.$queryRaw<any[]>`
    SELECT *
    FROM wallets
    WHERE id = ${walletId}
    FOR UPDATE
  `;

    if (!rows.length) return null;

    return PrismaWalletMapper.toDomain(rows[0]);
  }
}
