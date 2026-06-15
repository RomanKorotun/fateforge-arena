import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty({ message: 'Поле room не може бути пустим' })
  @IsString({ message: 'Поле room повинно бути рядком' })
  room!: string;

  @IsNotEmpty({ message: 'Поле content не може бути пустим' })
  @IsString({ message: 'Поле content повинно бути рядком' })
  content!: string;
}
