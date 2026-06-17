import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptDuelRequestDto {
  @IsString({ message: 'Поле duelId повинно бути рядком' })
  @IsNotEmpty({ message: 'Поле duelId не може бути пустим' })
  duelId!: string;
}
