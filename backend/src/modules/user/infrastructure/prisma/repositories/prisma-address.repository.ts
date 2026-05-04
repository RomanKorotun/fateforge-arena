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

  // додати адресу користувача
  async createAddress(
    userId: string,
    data: AddAddressData,
  ): Promise<AddressEntity> {
    const address = await this.prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });
    return PrismaAddressMapper.toDomain(address);
  }

  // оновити адресу користувача
  async updateAddress(
    userId: string,
    data: Partial<AddAddressData>,
  ): Promise<AddressEntity> {
    const address = await this.prisma.address.update({
      where: { userId },
      data: {
        ...data,
      },
    });
    return PrismaAddressMapper.toDomain(address);
  }

  // отримати адресу користувача
  async getAddress(userId: string): Promise<AddressEntity | null> {
    const address = await this.prisma.address.findUnique({
      where: { userId },
    });
    if (!address) {
      return null;
    }
    return PrismaAddressMapper.toDomain(address);
  }
}
