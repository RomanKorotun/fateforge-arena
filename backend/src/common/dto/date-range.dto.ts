import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class DateRangeDto {
  @ApiPropertyOptional({
    description: 'Дата початку фільтрації',
    example: '2026-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Дата кінця фільтрації',
    example: '2026-06-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}
