import { ApiProperty } from '@nestjs/swagger';

export class BanUserSuccessResponseDto {
  @ApiProperty({
    description: 'ID користувача',
    example: '1dbd36aa-80fc-48a0-b911-d000ac761b34',
  })
  id!: string;

  @ApiProperty({ description: 'Імʼя користувача', example: 'poseydon' })
  username!: string;

  @ApiProperty({
    description: 'Email користувача',
    example: 'poseydon@gmail.com',
  })
  email!: string;

  @ApiProperty({ description: 'Чи забанений користувач', example: true })
  isBanned!: boolean;

  @ApiProperty({
    description: 'Дата закінчення бану',
    example: '2026-05-10T15:30:00.000Z',
    nullable: true,
  })
  banEndAt!: Date | null;
}
