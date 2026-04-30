import { IsDateString } from 'class-validator';

export class BanUserDto {
  @IsDateString()
  banEndAt!: string;
}
