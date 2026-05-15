import { Currency } from '../enums/currency.enum';

export class WalletEntity {
  constructor(
    public id: string,
    public userId: string,
    public balance: number,
    public currency: Currency,
  ) {}

  // canWithdraw(amount: number): boolean {
  //   return this.balance >= amount;
  // }

  // debit(amount: number) {
  //   if (!this.canWithdraw(amount)) {
  //     throw new Error("Insufficient balance");
  //   }
  //   this.balance -= amount;
  // }

  // credit(amount: number) {
  //   this.balance += amount;
  // }
}
