import { ApiProperty } from '@nestjs/swagger';

class ProfileDto {
  @ApiProperty({ description: 'Рейтинг користувача', example: 0 })
  rating!: number;

  @ApiProperty({ description: 'Рівень користувача', example: 0 })
  level!: number;
}

class AddressDto {
  @ApiProperty({ description: 'Країна користувача', example: 'Ukraine' })
  country!: string;
}

export class GetUsersSuccessResponseDto {
  @ApiProperty({ description: 'Імʼя користувача', example: 'poseydon' })
  username!: string;

  @ApiProperty({
    description: 'Дата створення користувача',
    example: '2026-05-01T05:16:50.387Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Профіль користувача (рейтинг та рівень)',
    type: ProfileDto,
  })
  profile!: ProfileDto;

  @ApiProperty({
    description: 'Адреса користувача',
    type: AddressDto,
    nullable: true,
  })
  address!: AddressDto | null;
}
