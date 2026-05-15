import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { WALLET_REPOSITORY } from '../../domain/repositories/wallet.repository.token';
import type { IWalletRepository } from '../../domain/repositories/wallet.repository';

@Injectable()
export class GetWalletBalanceUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(walletId: string, userId: string) {
    const wallet = await this.walletRepo.findByIdAndUserId(walletId, userId);

    if (!wallet) {
      throw new NotFoundException('Гаманець не знайдено');
    }

    return {
      balance: wallet.balance,
      currency: wallet.currency,
    };
  }
}
