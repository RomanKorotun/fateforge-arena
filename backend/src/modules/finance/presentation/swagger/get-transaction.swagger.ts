import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetTransactionsSuccessResponseDto } from '../dto/get-transactions/get-transactions-success-response.dto';
import { GetTransactionsForbiddenResponseDto } from '../dto/get-transactions/get-transactions-forbidden-response.dto';
import { GetTransactionsBadRequestResponseDto } from '../dto/get-transactions/get-transactions-bad-request-response.dto';
import { GetTransactionsUnauthorizedResponseDto } from '../dto/get-transactions/get-transactions-unauthorized-response.dto';

export const GetTransactionsSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати список транзакцій',
      description:
        'Повертає список транзакцій користувача. ADMIN може бачити всі транзакції або фільтрувати по userId. USER може бачити тільки свої транзакції.',
    }),

    ApiOkResponse({
      type: GetTransactionsSuccessResponseDto,
      description: 'Список транзакцій успішно отримано',
    }),

    ApiUnauthorizedResponse({
      type: GetTransactionsUnauthorizedResponseDto,
      description: 'Користувач не авторизований або токен недійсний',
    }),

    ApiForbiddenResponse({
      type: GetTransactionsForbiddenResponseDto,
      description:
        'Користувач намагається отримати доступ до транзакцій іншого користувача',
    }),

    ApiBadRequestResponse({
      type: GetTransactionsBadRequestResponseDto,
      description: 'Некоректні query параметри (page, limit, date range тощо)',
    }),
  );
};
