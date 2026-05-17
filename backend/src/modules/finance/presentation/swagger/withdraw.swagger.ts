import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

export const WithdrawSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Зняття коштів з балансу користувача',
      description: `Створює транзакцію зняття та зменшує баланс гаманця користувача.`,
    }),
  );
};
