import { Address } from 'prisma/generated';
import { AddressEntity } from '../../../domain/entities/address.entity';

export class PrismaAddressMapper {
  static toDomain(address: Address): AddressEntity {
    return new AddressEntity(
      address.firstName,
      address.lastName,
      address.phoneNumber,
      address.postalCode,
      address.address,
      address.city,
      address.country,
    );
  }
}
