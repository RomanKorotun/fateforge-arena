export interface AddAddressCommand {
  userId: string;
  data: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    postalCode: string;
    city: string;
    address2?: string;
    country?: string;
  };
}
