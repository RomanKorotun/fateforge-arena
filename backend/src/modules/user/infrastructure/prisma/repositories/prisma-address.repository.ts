import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/prisma/prisma.service';
import {
  AddAddressData,
  IAddressRepository,
} from '../../../domain/repositories/address.repository';
import { AddressEntity } from '../../../domain/entities/address.entity';
import { PrismaAddressMapper } from '../mappers/prisma-address.mapper';

@Injectable()
export class PrismaAddressRepository implements IAddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addAddress(
    userId: string,
    data: AddAddressData,
  ): Promise<AddressEntity> {
    const address = await this.prisma.address.create({
      data: { userId, ...data },
    });
    return PrismaAddressMapper.toDomain(address);
  }
}
