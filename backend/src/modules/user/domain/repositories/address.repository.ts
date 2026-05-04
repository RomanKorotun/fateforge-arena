import { AddressEntity } from '../entities/address.entity';

export interface AddAddressData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface IAddressRepository {
  createAddress(userId: string, data: AddAddressData): Promise<AddressEntity>;
  updateAddress(
    userId: string,
    data: Partial<AddAddressData>,
  ): Promise<AddressEntity>;
  getAddress(userId: string): Promise<AddressEntity | null>;
}
