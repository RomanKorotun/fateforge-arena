import { applyDecorators } from '@nestjs/common';
import {
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ConfirmEmailSuccessResponseDto } from '../dto/confirm-email/confirm-email-success-response.dto';
import { ConfirmEmailNotFoundResponseDto } from '../dto/confirm-email/confirm-email-not-found-response.dto';
import { ConfirmEmailTokenExpiredResponseDto } from '../dto/confirm-email/confirm-email-token-expired-response-dto';

export const ConfirmEmailSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Підтвердження email',
      description:
        'Підтверджує електронну адресу користувача за verification token',
    }),

    ApiOkResponse({
      type: ConfirmEmailSuccessResponseDto,
      description: 'Email успішно підтверджено',
    }),

    ApiNotFoundResponse({
      type: ConfirmEmailNotFoundResponseDto,
      description: 'Токен підтвердження не знайдено або недійсний',
    }),

    ApiGoneResponse({
      type: ConfirmEmailTokenExpiredResponseDto,
      description: 'Термін дії токена підтвердження закінчився',
    }),
  );
};
