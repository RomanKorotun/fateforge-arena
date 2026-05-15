import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';

export const DepositSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiHeader({
      name: 'idempotency-key',
      required: true,
      description: 'Унікальний ключ для захисту від дублювання запитів',
      example: 'a1b2c3d4e5',
    }),

    ApiOperation({
      summary: 'Поповнення балансу користувача',
      description: `Створює транзакцію поповнення та збільшує баланс гаманця користувача.`,
    }),
  );
};
