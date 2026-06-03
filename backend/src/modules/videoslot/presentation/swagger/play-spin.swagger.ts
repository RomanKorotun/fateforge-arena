import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PlayVideoSlotDto } from '../dto/videoslot.dto';

export const PlaySpinSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Spin у відеослоті',
      description: 'Запускає один ігровий спін.',
    }),

    ApiBody({
      type: PlayVideoSlotDto,
      description: 'Параметри спіну',
    }),

    ApiCreatedResponse({
      description: 'Спін виконано успішно.',
    }),

    ApiBadRequestResponse({
      description: 'Некоректний запит.',
    }),

    ApiNotFoundResponse({
      description: 'Ресурс не знайдено.',
    }),

    ApiUnauthorizedResponse({
      description: 'Користувач не авторизований.',
    }),
  );
};
