import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdempotencyKeyPipe implements PipeTransform {
  transform(value: unknown) {
    if (!value) {
      throw new BadRequestException('Missing idempotency-key header');
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('idempotency-key must be a string');
    }

    if (value.trim().length < 5) {
      throw new BadRequestException('idempotency-key is too short');
    }

    return value;
  }
}
