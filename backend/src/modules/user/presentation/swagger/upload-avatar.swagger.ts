import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UploadAvatarSuccessResponseDto } from '../dto/upload-avatar/upload-avatar-success-response.dto';
import { UploadAvatarUnauthorizedResponseDto } from '../dto/upload-avatar/upload-avatar-unauthorized-response.dto';
import { UploadAvatarBadRequestResponseDto } from '../dto/upload-avatar/upload-avatar-bad-request-response.dto';

export const UploadAvatarSwagger = () => {
  return applyDecorators(
    ApiBearerAuth('accessToken'),

    ApiOperation({
      summary: 'Завантаження аватара користувача',
      description:
        'Завантажує файл аватара для авторизованого користувача. Підтримується multipart/form-data.',
    }),

    ApiConsumes('multipart/form-data'),

    ApiBody({
      schema: {
        type: 'object',
        properties: {
          avatar: {
            type: 'string',
            format: 'binary',
            description: 'Файл аватара',
          },
        },
        required: ['avatar'],
      },
    }),

    ApiOkResponse({
      type: UploadAvatarSuccessResponseDto,
      description: 'Аватар успішно завантажено',
    }),

    ApiBadRequestResponse({
      type: UploadAvatarBadRequestResponseDto,
      description:
        'Некоректний файл аватара або помилка валідації (відсутній файл, неправильний формат або перевищено розмір)',
    }),

    ApiUnauthorizedResponse({
      type: UploadAvatarUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
