import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/prisma/prisma.module';
import { PrismaUnitOfWork } from '../../core/prisma/prisma-unit-of-work';

import { UNIT_OF_WORK } from '../../common/tokens/unit-of-work.token';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaUnitOfWork,
    { provide: UNIT_OF_WORK, useExisting: PrismaUnitOfWork },
  ],
  exports: [UNIT_OF_WORK],
})
export class DatabaseModule {}
