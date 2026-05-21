import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateDepositSuccessResponseDto } from '../dto/create-deposit/create-deposit-success-response.dto';
import { CreateDepositUnauthorizedResponseDto } from '../dto/create-deposit/create-deposit-unauthorized-response.dto';
import { CreateDepositBadRequestResponseDto } from '../dto/create-deposit/create-deposit-bad-request-response.dto';
import { CreateDepositNotFoundResponseDto } from '../dto/create-deposit/create-deposit-not-found-response.dto';

export const CreateDepositSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Створити депозит (поповнення балансу)',
      description:
        'Створює транзакцію поповнення гаманця та повертає платіжний лінк.',
    }),

    ApiHeader({
      name: 'idempotency-key',
      required: true,
      description: 'Idempotency key for preventing duplicate requests',
    }),

    ApiOkResponse({
      type: CreateDepositSuccessResponseDto,
      description: 'Депозит успішно створено, повернуто платіжний лінк',
    }),

    ApiUnauthorizedResponse({
      type: CreateDepositUnauthorizedResponseDto,
      description: 'Користувач не авторизований або токен недійсний',
    }),

    ApiNotFoundResponse({
      type: CreateDepositNotFoundResponseDto,
      description: 'Гаманець користувача не знайдено',
    }),

    ApiBadRequestResponse({
      type: CreateDepositBadRequestResponseDto,
      description:
        'Некоректні дані запиту або непідтримуваний payment provider',
    }),
  );
};
