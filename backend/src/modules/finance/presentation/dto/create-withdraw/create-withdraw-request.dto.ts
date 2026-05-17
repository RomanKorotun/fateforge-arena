import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Currency } from '../../../domain/enums/currency.enum';
import { PaymentProvider } from '../../../domain/enums/payment-provider.enum';

export class CreateWithdrawRequestDto {
  @ApiProperty({
    description: 'ID гаманця',
    example: 'cmf4k5l2p0000v8z1x9a2b3c4',
  })
  @IsString({
    message: 'Поле walletId повинно бути рядком',
  })
  walletId!: string;

  @ApiProperty({
    description: 'Сума зняття',
    example: 50,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Поле amount повинно бути числом' })
  @Min(1, {
    message: 'Мінімальна сума зняття 1',
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
    description: 'Провайдер (імітація платіжної системи для виводу)',
    enum: PaymentProvider,
    example: PaymentProvider.LIQPAY,
  })
  @IsEnum(PaymentProvider, {
    message: 'Не валідний платіжний провайдер',
  })
  provider!: PaymentProvider;
}
