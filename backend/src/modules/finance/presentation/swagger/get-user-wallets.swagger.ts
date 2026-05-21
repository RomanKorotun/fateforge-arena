import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetUserWalletsSuccessResponseDto } from '../dto/get-user-wallets/get-user-wallets-success-response.dto';
import { GetUserWalletsUnauthorizedResponseDto } from '../dto/get-user-wallets/get-user-wallets-unauthorized-response.dto';

export const GetUserWalletsSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати всі гаманці користувача',
      description: 'Повертає список усіх гаманців авторизованого користувача.',
    }),

    ApiOkResponse({
      type: GetUserWalletsSuccessResponseDto,
      description: 'Список гаманців користувача',
    }),

    ApiUnauthorizedResponse({
      type: GetUserWalletsUnauthorizedResponseDto,
      description: 'Користувач не аутентифікований або accessToken недійсний',
    }),
  );
};
