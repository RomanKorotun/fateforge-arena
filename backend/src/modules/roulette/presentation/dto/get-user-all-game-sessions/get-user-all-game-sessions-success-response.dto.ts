import { ApiProperty } from '@nestjs/swagger';

export class GetUserAllGameSessionResponseDto {
  @ApiProperty({
    description: 'ID ігрової сесії',
    example: 'a2f71f7c-aa9e-43bb-87ff-6d5e636676d1',
  })
  id!: string;

  @ApiProperty({
    description: 'Client seed користувача',
    example: 'my-seed',
  })
  clientSeed!: string;

  @ApiProperty({
    description: 'Nonce (кількість ставок у сесії)',
    example: 0,
  })
  nonce!: number;

  @ApiProperty({
    description: 'Чи активна сесія',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Дата створення сесії',
    example: '2026-05-20T08:10:03.436Z',
  })
  createdAt!: Date;
}
