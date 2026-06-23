import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';

import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';
import { Currency } from '../../domain/enums/currency.enum';

import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { DateRangeDto } from '../../../../common/dto/date-range.dto';

export class GetTransactionsQueryDto extends IntersectionType(
  PaginationDto,
  DateRangeDto,
) {
  @ApiPropertyOptional({
    description: 'ID користувача (тільки для ADMIN)',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'ID гаманця',
  })
  @IsOptional()
  @IsUUID()
  walletId?: string;

  @ApiPropertyOptional({
    enum: TransactionType,
    description: 'Тип транзакції',
    example: TransactionType.DEPOSIT,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({
    enum: TransactionStatus,
    description: 'Статус транзакції',
    example: TransactionStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiPropertyOptional({
    enum: PaymentProvider,
    description: 'Платіжний провайдер',
    example: PaymentProvider.STRIPE,
  })
  @IsOptional()
  @IsEnum(PaymentProvider)
  provider?: PaymentProvider;

  @ApiPropertyOptional({
    enum: Currency,
    description: 'Валюта',
    example: Currency.UAH,
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
