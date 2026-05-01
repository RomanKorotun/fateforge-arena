import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RestoreSuccessResponseDto } from '../dto/restore/restore-success-response.dto';
import { RestoreUnauthorizedResponseDto } from '../dto/restore/restore-unauthorized-response.dto';
import { RestoreBadRequestResponseDto } from '../dto/restore/restore-bad-request-response.dto';

export const RestoreSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Відновлення користувача',
      description:
        'Відновлює доступ користувача до системи та повертає його актуальні дані.',
    }),
    ApiOkResponse({
      type: RestoreSuccessResponseDto,
      description: 'Успішне відновлення користувача',
    }),
    ApiUnauthorizedResponse({
      type: RestoreUnauthorizedResponseDto,
      description: 'Невірний email або пароль. Доступ заборонено.',
    }),
    ApiBadRequestResponse({
      type: RestoreBadRequestResponseDto,
      description: 'Некоректні вхідні дані. Помилка валідації полів',
    }),
  );
};
