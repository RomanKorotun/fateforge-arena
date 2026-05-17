import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

export const GetBalanceSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати баланс гаманця',
      description: 'Повертає баланс і валюту конкретного гаманця користувача.',
    }),

    ApiParam({
      name: 'walletId',
      required: true,
      description: 'ID гаманця',
      example: 'cmf4k5l2p0000v8z1x9a2b3c4',
    }),
  );
};
