import { ApiProperty } from '@nestjs/swagger';

export class AddAddressSuccessResponseDto {
  @ApiProperty({ description: 'Імʼя', example: 'Bill' })
  firstName!: string;

  @ApiProperty({ description: 'Прізвище', example: 'Gates' })
  lastName!: string;

  @ApiProperty({ description: 'Номер телефону', example: '+380501234567' })
  phoneNumber!: string;

  @ApiProperty({ description: 'Індекс', example: '02000' })
  postalCode!: string;

  @ApiProperty({ description: 'Основна адреса', example: 'вул. Шевченка, 12' })
  address!: string;

  @ApiProperty({ description: 'Місто', example: 'Kyiv' })
  city!: string;

  @ApiProperty({ description: 'Країна', example: 'Ukraine' })
  country!: string;
}
