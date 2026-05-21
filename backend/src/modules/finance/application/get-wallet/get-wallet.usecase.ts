import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { WALLET_REPOSITORY } from '../../domain/repositories/wallet/wallet.repository.token';
import type { IWalletRepository } from '../../domain/repositories/wallet/wallet.repository';

@Injectable()
export class GetWalletUseCase {
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
      id: wallet.id,
      balance: wallet.balance,
      currency: wallet.currency,
    };
  }
}
