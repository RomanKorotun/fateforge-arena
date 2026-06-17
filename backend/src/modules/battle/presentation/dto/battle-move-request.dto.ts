import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Zone } from '../../domain/enums/zone.enum';

export class BattleMoveRequestDto {
  @IsString({ message: 'Поле roomId повинно бути рядком' })
  @IsNotEmpty({ message: 'Поле roomId не може бути пустим' })
  roomId!: string;

  @IsEnum(Zone, {
    message:
      'Поле attackZone повинно бути одним із значень HEAD, BODY або LEGS',
  })
  @IsNotEmpty({ message: 'Поле attackZone не може бути пустим' })
  attackZone!: Zone;

  @IsEnum(Zone, {
    message:
      'Поле defenseZone повинно бути одним із значень HEAD, BODY або LEGS',
  })
  @IsNotEmpty({ message: 'Поле defenseZone не може бути пустим' })
  defenseZone!: Zone;
}
