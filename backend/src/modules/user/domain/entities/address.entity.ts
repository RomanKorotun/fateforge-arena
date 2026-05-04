export class AddressEntity {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phoneNumber: string,
    public readonly postalCode: string,
    public readonly address: string,
    public readonly city: string,
    public readonly country: string,
  ) {}
}
