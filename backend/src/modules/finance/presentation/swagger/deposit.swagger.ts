import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

export const DepositSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Поповнення балансу користувача',
      description: `Створює транзакцію поповнення та збільшує баланс гаманця користувача.`,
    }),
  );
};
