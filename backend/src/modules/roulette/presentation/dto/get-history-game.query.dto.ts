import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetHistoryGameQueryDto {
  @ApiProperty({ required: true, description: 'Номер сторінки' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: true, description: 'Кількість записів' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  limit: number = 20;

  @ApiProperty({ required: false, description: 'Фільтр по ID ігрової сесії' })
  @IsString()
  @IsOptional()
  gameSessionId?: string;
}
