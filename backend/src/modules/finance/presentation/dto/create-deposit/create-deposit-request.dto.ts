import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Currency } from '../../../domain/enums/currency.enum';
import { PaymentProvider } from '../../../domain/enums/payment-provider.enum';

export class CreateDepositRequestDto {
  @ApiProperty({
    description: 'ID гаманця',
    example: 'cmf4k5l2p0000v8z1x9a2b3c4',
  })
  @IsString({
    message: 'Поле walletId повинно бути рядком',
  })
  walletId!: string;

  @ApiProperty({
    description: 'Сума поповнення',
    example: 100,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Поле amount повинно бути числом' })
  @Min(1, {
    message: 'Мінімальна сума поповнення 1',
  })
  amount!: number;

  @ApiProperty({
    description: 'Валюта',
    enum: Currency,
    example: Currency.UAH,
  })
  @IsEnum(Currency, {
    message: 'Не валідна валюта',
  })
  currency!: Currency;

  @ApiProperty({
    description: 'Платіжний провайдер',
    enum: PaymentProvider,
    example: PaymentProvider.LIQPAY,
  })
  @IsEnum(PaymentProvider, {
    message: 'Не валідний платіжний провайдер',
  })
  provider!: PaymentProvider;
}
