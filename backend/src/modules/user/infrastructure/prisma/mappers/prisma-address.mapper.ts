import { Address } from 'prisma/generated';
import { AddressEntity } from '../../../domain/entities/address.entity';

export class PrismaAddressMapper {
  static toDomain(address: Address): AddressEntity {
    return new AddressEntity(
      address.firstName,
      address.lastName,
      address.phoneNumber,
      address.address,
      address.postalCode,
      address.city,
      address.address2 ?? null,
      address.country ?? null,
    );
  }
}
