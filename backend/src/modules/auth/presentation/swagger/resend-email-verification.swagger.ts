import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ResendEmailVerificationSuccessResponseDto } from '../dto/resend-email-verification/resend-email-verification-success-response.dto';
import { ResendEmailVerificationNotFoundResponseDto } from '../dto/resend-email-verification/resend-email-verification-not-found-response.dto';
import { ResendEmailVerificationBadRequestResponseDto } from '../dto/resend-email-verification/resend-email-verification-bad-request-response.dto';

export const ResendEmailVerificationSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Повторна відправка листа підтвердження email',
      description:
        'Надсилає користувачу новий лист для підтвердження електронної пошти',
    }),

    ApiOkResponse({
      type: ResendEmailVerificationSuccessResponseDto,
      description: 'Лист успішно відправлено повторно',
    }),

    ApiNotFoundResponse({
      type: ResendEmailVerificationNotFoundResponseDto,
      description: 'Користувача не знайдено',
    }),

    ApiBadRequestResponse({
      type: ResendEmailVerificationBadRequestResponseDto,
      description: 'Email вже підтверджено',
    }),
  );
};