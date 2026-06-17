import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveRoomRequestDto {
  @IsNotEmpty({ message: 'Поле room не може бути пустим' })
  @IsString({ message: 'Поле room повинно бути рядком' })
  room!: string;
}
