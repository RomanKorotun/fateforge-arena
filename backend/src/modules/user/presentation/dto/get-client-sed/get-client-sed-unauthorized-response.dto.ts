import { ApiProperty } from '@nestjs/swagger';

export class GetClientSeedUnauthorizedResponseDto {
  @ApiProperty({ example: 401 })
  status!: number;

  @ApiProperty({ example: 'Unauthorized' })
  message!: string;

  @ApiProperty({ example: '/api/auth/me/client-seed' })
  url!: string;

  @ApiProperty({ example: '2026-05-20T10:00:00.000Z' })
  timestamp!: string;
}
