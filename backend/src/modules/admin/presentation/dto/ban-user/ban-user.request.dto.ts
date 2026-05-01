import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class BanUserDto {
  @ApiProperty({
    description: 'Дата та час, до якого користувач буде заблокований',
    example: '2026-05-10T15:30:00.000Z',
  })
  @IsDateString()
  banEndAt!: string;
}
