import { Inject, Injectable } from '@nestjs/common';

import { AddAddressCommand } from './add-address.command';
import { ADDRESS_REPOSITORY } from '../../../domain/repositories/address.repository.token';
import type { IAddressRepository } from '../../../domain/repositories/address.repository';

@Injectable()
export class AddAddressUseCase {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute({ userId, data }: AddAddressCommand) {
    return await this.addressRepository.addAddress(userId, data);
  }
}
