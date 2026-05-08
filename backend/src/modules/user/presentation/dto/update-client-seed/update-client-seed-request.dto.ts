import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientSeedRequestDto {
  @ApiProperty({ description: 'Client seed користувача', example: 'my-seed' })
  @IsNotEmpty({ message: 'clientSeed не може бути пустим' })
  @IsString({ message: 'clientSeed має бути рядком' })
  clientSeed!: string;
}
