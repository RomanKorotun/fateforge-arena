import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetUserAllGameSessionResponseDto } from '../dto/get-user-all-game-sessions/get-user-all-game-sessions-success-response.dto';
import { GetUserAllGameSessionsUnauthorizedResponseDto } from '../dto/get-user-all-game-sessions/get-user-all-game-sessions-unauthorized-response.dto';

export const GetUserSessionsSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати ігрові сесії користувача',
      description:
        'Повертає список усіх ігрових сесій поточного авторизованого користувача.',
    }),

    ApiOkResponse({
      type: GetUserAllGameSessionResponseDto,
      isArray: true,
      description: 'Список ігрових сесій користувача',
    }),

    ApiUnauthorizedResponse({
      type: GetUserAllGameSessionsUnauthorizedResponseDto,
      description: 'Користувач не авторизований або токен недійсний',
    }),
  );
};
