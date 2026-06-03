import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const CreateGameSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Створення ігрової сесії (slot game)',
      description: `Створює нову ігрову сесію для користувача.`,
    }),

    ApiCreatedResponse({
      description: `Сесію успішно створено.`,
    }),

    ApiUnauthorizedResponse({
      description: `Користувач не авторизований або accessToken недійсний.`,
    }),
  );
};
