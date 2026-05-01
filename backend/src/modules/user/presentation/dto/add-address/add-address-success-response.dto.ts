import { ApiProperty } from '@nestjs/swagger';

export class AddAddressSuccessResponseDto {
  @ApiProperty({ description: 'Імʼя', example: 'Roman' })
  firstName!: string;

  @ApiProperty({ description: 'Прізвище', example: 'Korotun' })
  lastName!: string;

  @ApiProperty({ description: 'Номер телефону', example: '+380639579765' })
  phoneNumber!: string;

  @ApiProperty({
    description: 'Основна адреса',
    example: 'вул. Київська, 247',
  })
  address!: string;

  @ApiProperty({
    description: 'Індекс',
    example: '56489',
  })
  postalCode!: string;

  @ApiProperty({
    description: 'Місто',
    example: 'Brovary',
  })
  city!: string;

  @ApiProperty({
    description: 'Додаткова адреса (може бути null)',
    example: null,
    nullable: true,
  })
  address2!: string | null;

  @ApiProperty({
    description: 'Країна',
    example: 'Ukraine',
  })
  country!: string;
}
