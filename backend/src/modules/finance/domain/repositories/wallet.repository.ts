import { WalletEntity } from '../entities/wallet.entity';
import { Currency } from '../enums/currency.enum';

export interface CreateWalletData {
  userId: string;
  currency?: Currency;
}

export interface IWalletRepository {
  // Створити гаманець для користувача
  createWallet(data: CreateWalletData, tx?: unknown): Promise<WalletEntity>;

  // Знайти гаманець по id гаманця і по userId
  findByIdAndUserId(
    walletId: string,
    userId: string,
    tx?: unknown,
  ): Promise<WalletEntity | null>;

  // Збільшити баланс (депозит / win)
  increaseBalance(
    walletId: string,
    amount: number,
    tx?: unknown,
  ): Promise<void>;

  // Зменшити баланс (withdraw / bet)
  decreaseBalance(
    walletId: string,
    amount: number,
    tx?: unknown,
  ): Promise<void>;

  lockById(walletId: string, tx?: unknown): Promise<WalletEntity | null>;
}
