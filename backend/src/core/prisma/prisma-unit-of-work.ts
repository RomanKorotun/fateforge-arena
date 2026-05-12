import { Injectable } from '@nestjs/common';

import { IUnitOfWork } from '../../common/contracts/unit-of-work.interface';

import { PrismaService } from './prisma.service';
import { PrismaTx } from './prisma.types';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork<PrismaTx> {
  constructor(private readonly prisma: PrismaService) {}

  transaction<T>(fn: (tx: PrismaTx) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
