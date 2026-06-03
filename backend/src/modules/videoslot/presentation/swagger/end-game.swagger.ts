import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const EndGameSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Завершення ігрової сесії',
      description: 'Завершує активну ігрову сесію користувача.',
    }),

    ApiOkResponse({
      description: 'Ігрову сесію успішно завершено.',
    }),

    ApiBadRequestResponse({
      description: 'Некоректний gameId або запит.',
    }),

    ApiNotFoundResponse({
      description: 'Активну ігрову сесію не знайдено.',
    }),

    ApiUnauthorizedResponse({
      description: 'Користувач не авторизований.',
    }),
  );
};
