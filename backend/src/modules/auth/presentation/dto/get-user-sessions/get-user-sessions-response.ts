import { ApiProperty } from '@nestjs/swagger';

class DeviceDto {
  @ApiProperty({ example: 'Postman Desktop' })
  browser!: string;

  @ApiProperty({ example: 'unknown' })
  os!: string;

  @ApiProperty({ example: 'desktop' })
  type!: string;
}

export class GetUserSessionsResponseDto {
  @ApiProperty({
    description: 'ID сесії',
    example: '84414d09-f002-4824-9af3-661dba1b3a0d',
  })
  sessionId!: string;

  @ApiProperty({
    description: 'IP адреса',
    example: '172.18.0.1',
  })
  ip!: string;

  @ApiProperty({
    description: 'Інформація про пристрій',
    type: DeviceDto,
  })
  device!: DeviceDto;

  @ApiProperty({
    description: 'Дата створення сесії',
    example: '2026-05-01T05:17:44.231Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Чи це поточна сесія',
    example: true,
  })
  isCurrent!: boolean;
}
