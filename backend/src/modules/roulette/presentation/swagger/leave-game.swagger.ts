import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { LeaveGameSuccessResponseDto } from '../dto/leave-game/leave-game-response-success.dto';
import { LeaveGameNotFoundResponseDto } from '../dto/leave-game/leave-game-not-found-response.dto';
import { LeaveGameForbiddenResponseDto } from '../dto/leave-game/leave-game-forbidden-response.dto';
import { LeaveGameUnauthorizedResponseDto } from '../dto/leave-game/leave-game-unauthorized-response.dto';
import { LeaveGameBadRequestResponseDto } from '../dto/leave-game/leave-game-bad-request-response.dto';

export const LeaveGameSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Leave game session',
      description: `Закриває ігрову сесію користувача (робить її неактивною). Якщо сесія вже неактивна — повертається її поточний стан.`,
    }),

    ApiOkResponse({
      type: LeaveGameSuccessResponseDto,
      description: 'Сесію успішно закрито або вона вже була неактивною.',
    }),

    ApiBadRequestResponse({
      type: LeaveGameBadRequestResponseDto,
      description: 'Невірний формат sessionId (не UUID)',
    }),

    ApiNotFoundResponse({
      type: LeaveGameNotFoundResponseDto,
      description: 'Game session не знайдена',
    }),

    ApiForbiddenResponse({
      type: LeaveGameForbiddenResponseDto,
      description: 'Користувач не є власником цієї сесії',
    }),

    ApiUnauthorizedResponse({
      type: LeaveGameUnauthorizedResponseDto,
      description: 'Користувач не авторизований',
    }),
  );
};
