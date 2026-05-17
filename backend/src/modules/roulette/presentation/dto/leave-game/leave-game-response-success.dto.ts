import { ApiProperty } from '@nestjs/swagger';

export class LeaveGameSuccessResponseDto {
  @ApiProperty({
    description: 'Повідомлення про результат операції',
    example: 'Session closed',
  })
  message!: string;

  @ApiProperty({
    description: 'ID ігрової сесії',
    example: '2a3efd55-7e43-4b22-b2cc-b9c70105133d',
  })
  sessionId!: string;

  @ApiProperty({
    description: 'Статус сесії (false — сесія закрита)',
    example: false,
  })
  isActive!: boolean;

  @ApiProperty({
    description:
      'Розкритий serverSeed (використовується для перевірки чесності гри після завершення сесії)',
    example: 'server-seed-revealed-string',
  })
  revealedServerSeed!: string;
}
