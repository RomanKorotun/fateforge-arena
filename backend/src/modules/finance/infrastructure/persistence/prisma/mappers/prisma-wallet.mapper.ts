import { Wallet } from 'prisma/generated';

import { WalletEntity } from '../../../../domain/entities/wallet.entity';
import { Currency } from '../../../../domain/enums/currency.enum';

export class PrismaWalletMapper {
  static toDomain(wallet: Wallet): WalletEntity {
    return new WalletEntity(
      wallet.id,
      wallet.userId,
      wallet.balance.toNumber(),
      wallet.currency as Currency,
    );
  }
}
