import { ApiProperty } from '@nestjs/swagger';

export class GetAllUsersSuccessResponseDto {
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

  @ApiProperty({
    description: 'Роль користувача',
    example: 'USER',
  })
  role!: string;

  @ApiProperty({
    description: 'Останній IP входу',
    example: '172.18.0.1',
    nullable: true,
  })
  lastLoginIp!: string | null;

  @ApiProperty({
    description: 'Дата останнього входу',
    example: '2026-05-01T05:17:44.242Z',
    nullable: true,
  })
  lastLoginAt!: Date | null;

  @ApiProperty({
    description: 'Чи забанений користувач',
    example: false,
  })
  isBanned!: boolean;

  @ApiProperty({
    description: 'Дата закінчення бану',
    example: null,
    nullable: true,
  })
  banEndAt!: Date | null;

  @ApiProperty({
    description: 'Чи видалений користувач',
    example: false,
  })
  isDeleted!: boolean;

  @ApiProperty({
    description: 'Дата видалення користувача',
    example: null,
    nullable: true,
  })
  detetedAt!: Date | null;

  @ApiProperty({
    description: 'Дата створення користувача',
    example: '2026-05-01T05:16:50.387Z',
  })
  createdAt!: Date;
}
