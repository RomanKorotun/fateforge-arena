import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

import { AVATAR_MAX_SIZE } from '../../../../common/constants/upload.constants';

@Injectable()
export class AvatarValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Avatar is required');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    if (file.size > AVATAR_MAX_SIZE) {
      throw new BadRequestException(
        `File too large (max ${AVATAR_MAX_SIZE / (1024 * 1024)}MB)`,
      );
    }
    return file;
  }
}
