import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageRequestDto {
  @IsNotEmpty({ message: 'Поле room не може бути пустим' })
  @IsString({ message: 'Поле room повинно бути рядком' })
  room!: string;

  @IsNotEmpty({ message: 'Поле content не може бути пустим' })
  @IsString({ message: 'Поле content повинно бути рядком' })
  @MaxLength(1000, {
    message: 'Повідомлення не може містити більше 1000 символів',
  })
  content!: string;
}
