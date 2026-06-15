import { Currency } from '../enums/currency.enum';

export class WalletEntity {
  constructor(
    public id: string,
    public userId: string,
    public balance: number,
    public currency: Currency,
  ) {}
}
