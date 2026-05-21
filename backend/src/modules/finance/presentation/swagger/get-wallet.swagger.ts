import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { GetWalletSuccessResponseDto } from '../dto/get-wallet/get-wallet-success-response.dto';
import { GetWalletUnauthorizedResponseDto } from '../dto/get-wallet/get-wallet-unauthorized-response.dto';
import { GetWalletBadRequestResponseDto } from '../dto/get-wallet/get-wallet-bad-request-response.dto';
import { GetWalletNotFoundResponseDto } from '../dto/get-wallet/get-wallet-not-found-response.dto';

export const GetWalletSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати баланс гаманця',
      description: 'Повертає баланс і валюту конкретного гаманця користувача.',
    }),

    ApiParam({
      name: 'walletId',
      required: true,
      description: 'ID гаманця (UUID)',
    }),

    ApiOkResponse({
      type: GetWalletSuccessResponseDto,
      description: 'Гаманець успішно знайдено',
    }),

    ApiUnauthorizedResponse({
      type: GetWalletUnauthorizedResponseDto,
      description: 'Користувач не авторизований або accessToken недійсний',
    }),

    ApiBadRequestResponse({
      type: GetWalletBadRequestResponseDto,
      description: 'Некоректний формат walletId (невалідний UUID)',
    }),

    ApiNotFoundResponse({
      type: GetWalletNotFoundResponseDto,
      description: 'Гаманець не знайдено або не належить користувачу',
    }),
  );
};
