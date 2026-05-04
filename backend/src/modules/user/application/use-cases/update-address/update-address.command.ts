export interface UpdateAddressCommand {
  userId: string;
  data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    postalCode?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}
