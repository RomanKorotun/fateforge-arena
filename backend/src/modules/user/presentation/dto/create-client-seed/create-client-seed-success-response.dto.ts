import { ApiProperty } from '@nestjs/swagger';

export class CreateClientSeedSuccessResponseDto {
  @ApiProperty({
    description: 'ID користувача',
    example: 'b3f1c2a0-8d2e-4c1a-9a12-8f9c1d2e3a4b',
  })
  userId!: string;

  @ApiProperty({
    description: 'Client seed користувача',
    example: 'my-custom-seed-123',
  })
  clientSeed!: string;
}
