import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDto {
  @ApiProperty({
    description: 'Імʼя користувача',
    example: 'Bill',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Поле firstName повинно бути рядком' })
  firstName?: string;

  @ApiProperty({
    description: 'Прізвище користувача',
    example: 'Gates',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Поле lastName повинно бути рядком' })
  lastName?: string;

  @ApiProperty({
    description: 'Номер телефону',
    example: '+380501234567',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Поле phoneNumber повинно бути рядком' })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Адреса',
    example: 'вул. Шевченка, 12',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Поле address повинно бути рядком' })
  address?: string;

  @ApiProperty({
    description: 'Поштовий індекс',
    example: '02000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Поле postalCode повинно бути рядком' })
  @Length(4, 10, {
    message: 'Поле postalCode повинно містити від 4 до 10 символів',
  })
  postalCode?: string;

  @ApiProperty({ description: 'Місто', example: 'Kyiv', required: false })
  @IsOptional()
  @IsString({ message: 'Поле city повинно бути рядком' })
  city?: string;

  @ApiProperty({ description: 'Країна', example: 'Ukraine', required: false })
  @IsOptional()
  @IsString({ message: 'Поле country повинно бути рядком' })
  country?: string;
}
