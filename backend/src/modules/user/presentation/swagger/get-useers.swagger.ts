import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetUsersSuccessResponseDto } from '../dto/get-users/get-users-success-response.dto';
import { GetUsersUnauthorizedResponseDto } from '../dto/get-users/get-users-unauthorized-response.dto';

export const GetUserSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати список користувачів',
      description:
        'Повертає список користувачів з обмеженою публічною інформацією (username, дата створення, профіль з рейтингом та адреса). Використовується для відображення рейтингу та статистики.',
    }),

    ApiOkResponse({
      type: GetUsersSuccessResponseDto,
      isArray: true,
      description: 'Список користувачів з публічною інформацією',
    }),

    ApiUnauthorizedResponse({
      type: GetUsersUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
