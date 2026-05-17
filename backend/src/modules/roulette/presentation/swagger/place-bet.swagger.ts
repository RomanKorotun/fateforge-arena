import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PlaceBetSuccessResponseDto } from '../dto/place-bet/place-bet-success-response.dto';
import { PlaceBetUnauthorizedResponseDto } from '../dto/place-bet/place-bet-unauthorized-response.dto';
import { PlaceBetNotFoundResponseDto } from '../dto/place-bet/place-bet-not-found-response.dto';
import { PlaceBetBadRequestResponseDto } from '../dto/place-bet/place-bet-bad-request-response.dto';

export const PlaceBetSwagger = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Зробити ставку в рулетці',
      description:
        'Створює ставки для активної ігрової сесії та повертає результат спіну.',
    }),

    ApiOkResponse({
      type: PlaceBetSuccessResponseDto,
      description: 'Ставка успішно оброблена, повернуто результат спіну.',
    }),

    ApiUnauthorizedResponse({
      type: PlaceBetUnauthorizedResponseDto,
      description: 'Користувач не аутентифікований.',
    }),

    ApiNotFoundResponse({
      type: PlaceBetNotFoundResponseDto,
      description: 'Ігрову сесію не знайдено.',
    }),

    ApiBadRequestResponse({
      type: PlaceBetBadRequestResponseDto,
      description: 'Невалідні дані ставки або формат запиту.',
    }),
  );
