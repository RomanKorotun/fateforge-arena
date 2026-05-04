import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';

export class ParseUuidPipe extends ParseUUIDPipe {
  constructor() {
    super({
      exceptionFactory: () => new BadRequestException('Invalid id format'),
    });
  }
}
