import { Inject, Injectable } from '@nestjs/common';

import type { IAddressRepository } from '../../../domain/repositories/address.repository';
import { ADDRESS_REPOSITORY } from '../../../domain/repositories/address.repository.token';

@Injectable()
export class GetAddressUseCase {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(userId: string) {
    const address = await this.addressRepository.getAddress(userId);

    if (!address) {
      return null;
    }

    return address;
  }
}
