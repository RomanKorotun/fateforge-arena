import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Fateforge Arena API')
  .setDescription(
    'Fateforge Arena — бекенд-сервіс для керування користувачами, авторизацією та ігровими механіками арени. ' +
      'Гравці можуть створювати акаунти, входити в систему, брати участь у боях на арені та взаємодіяти з системою рулетки для отримання нагород.',
  )
  .setVersion('0.0.1')
  .setContact(
    'Roman Korotun',
    'https://github.com/RomanKorotun/fateforge-arena',
    'roman.korotun@ukr.net',
  )
  .addCookieAuth('accessToken')
  .build();
