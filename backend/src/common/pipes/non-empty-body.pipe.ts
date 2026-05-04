import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class NonEmptyBodyPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException(
        'Невірний формат тіла запиту: очікується обʼєкт',
      );
    }

    const hasData = Object.values(value).some(
      (v) => v !== undefined && v !== null,
    );

    if (!hasData) {
      throw new BadRequestException('Запит повинен містити хоча б одне поле');
    }

    return value;
  }
}
