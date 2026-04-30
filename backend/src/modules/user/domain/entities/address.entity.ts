export class AddressEntity {
  constructor(
    public readonly firstName: string, // ім’я
    public readonly lastName: string, // прізвище
    public readonly phoneNumber: string, // телефон
    public readonly address: string, // основна адреса
    public readonly postalCode: string, // поштовий індекс
    public readonly city: string, // місто
    public readonly address2: string | null, // додаткова адреса (якщо є)
    public readonly country: string | null, // країна (якщо є)
  ) {}
}
