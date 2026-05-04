import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UpdateAddressCommand } from './update-address.command';
import { ADDRESS_REPOSITORY } from '../../../domain/repositories/address.repository.token';
import type { IAddressRepository } from '../../../domain/repositories/address.repository';

@Injectable()
export class UpdateAddressUseCase {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute({ userId, data }: UpdateAddressCommand) {
    await this.addressRepository.updateAddress(userId, data);
    return { message: 'Адресу успішно оновлено' };
  }
}
