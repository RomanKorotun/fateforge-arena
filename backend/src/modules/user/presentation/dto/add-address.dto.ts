import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class AddAddressDto {
  @IsNotEmpty({ message: 'Поле firstName не може бути пустим' })
  @IsString({ message: 'Поле firstName повинно бути рядком' })
  firstName!: string;

  @IsNotEmpty({ message: 'Поле lastName не може бути пустим' })
  @IsString({ message: 'Поле lastName повинно бути рядком' })
  lastName!: string;

  @IsNotEmpty({ message: 'Поле phoneNumber не може бути пустим' })
  @IsString({ message: 'Поле phoneNumber повинно бути рядком' })
  phoneNumber!: string;

  @IsNotEmpty({ message: 'Поле address не може бути пустим' })
  @IsString({ message: 'Поле address повинно бути рядком' })
  address!: string;

  @IsNotEmpty({ message: 'Поле postalCode не може бути пустим' })
  @IsString({ message: 'Поле postalCode повинно бути рядком' })
  @Length(4, 10, {
    message: 'Поле postalCode повинно містити від 4 до 10 символів',
  })
  postalCode!: string;

  @IsNotEmpty({ message: 'Поле city не може бути пустим' })
  @IsString({ message: 'Поле city повинно бути рядком' })
  city!: string;

  @IsOptional()
  @IsString({ message: 'Поле address2 повинно бути рядком' })
  address2?: string;

  @IsOptional()
  @IsString({ message: 'Поле country повинно бути рядком' })
  country?: string;
}
