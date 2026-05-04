import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetUserSessionsSuccessResponseDto } from '../dto/get-user-sessions/get-user-sessions-success-response';
import { GetUserSessionsUnauthorizedResponseDto } from '../dto/get-user-sessions/get-user-sessions-unauthorized-response.dto';

export const GetUserSessionsSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати сесії користувача',
      description:
        'Повертає список активних сесій користувача (пристрої, IP, дата створення, поточна сесія)',
    }),

    ApiOkResponse({
      type: GetUserSessionsSuccessResponseDto,
      isArray: true,
      description: 'Список сесій користувача',
    }),

    ApiUnauthorizedResponse({
      type: GetUserSessionsUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
