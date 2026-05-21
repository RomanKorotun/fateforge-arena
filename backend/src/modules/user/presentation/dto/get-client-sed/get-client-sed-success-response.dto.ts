import { ApiProperty } from '@nestjs/swagger';

export class GetClientSeedSuccessResponseDto {
  @ApiProperty({
    description: 'Client seed користувача',
    example: 'my-client-seed-123',
  })
  clientSeed!: string;
}
