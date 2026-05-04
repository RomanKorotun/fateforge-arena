import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AddAddressSuccessResponseDto } from '../dto/add-address/add-address-success-response.dto';
import { AddAddressUnauthorizedResponseDto } from '../dto/add-address/add-address-unauthorized-response.dto';
import { AddAddressBadRequestResponseDto } from '../dto/add-address/add-address-bad-request-response.dto';

export const AddAddressSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Додати адресу користувача',
      description: `Додає нову адресу для авторизованого користувача.`,
    }),

    ApiCreatedResponse({
      type: AddAddressSuccessResponseDto,
      description:
        'Адреса успішно додана. У відповіді повертається обʼєкт адреси.',
    }),

    ApiBadRequestResponse({
      type: AddAddressBadRequestResponseDto,
      description: `Некоректні дані у тілі запиту. Наприклад: відсутні обовʼязкові поля або вони мають неправильний формат.`,
    }),

    ApiUnauthorizedResponse({
      type: AddAddressUnauthorizedResponseDto,
      description: `Користувач не авторизований. Відсутній або недійсний accessToken.`,
    }),
  );
};
