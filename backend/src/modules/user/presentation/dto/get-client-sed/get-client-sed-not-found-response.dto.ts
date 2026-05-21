import { ApiProperty } from '@nestjs/swagger';

export class GetClientSeedNotFoundResponseDto {
  @ApiProperty({ example: 404 })
  status!: number;

  @ApiProperty({ example: 'Client seed not found' })
  message!: string;

  @ApiProperty({ example: '/api/auth/me/client-seed' })
  url!: string;

  @ApiProperty({ example: '2026-05-20T10:00:00.000Z' })
  timestamp!: string;
}
