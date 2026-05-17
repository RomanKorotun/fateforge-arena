import { ApiProperty } from '@nestjs/swagger';

export class CreateGameSessionSuccessResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID ігрової сесії',
  })
  sessionId!: string;

  @ApiProperty({
    example: 'a3f1c9d8b2e4...',
    description: 'Хеш серверного seed (provably fair)',
  })
  serverHash!: string;

  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Client seed користувача',
  })
  clientSeed!: string;
}
