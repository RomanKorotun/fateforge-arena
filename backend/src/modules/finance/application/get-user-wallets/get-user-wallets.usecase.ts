import { Inject, Injectable } from '@nestjs/common';

import type { IWalletRepository } from '../../domain/repositories/wallet/wallet.repository';
import { WALLET_REPOSITORY } from '../../domain/repositories/wallet/wallet.repository.token';

@Injectable()
export class GetUserWalletsUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(userId: string) {
    const wallets = await this.walletRepo.findAllByUserId(userId);
    return {
      wallets: wallets.map((wallet) => ({
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
      })),
    };
  }
}
