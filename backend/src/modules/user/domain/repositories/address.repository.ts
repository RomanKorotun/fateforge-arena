import { AddressEntity } from '../entities/address.entity';

export interface AddAddressData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  postalCode: string;
  city: string;
  address2?: string;
  country?: string;
}

export interface IAddressRepository {
  addAddress(userId: string, data: AddAddressData): Promise<AddressEntity>;
}
