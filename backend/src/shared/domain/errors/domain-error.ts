export class DomainError extends Error {
  constructor(
    message: string,
    public readonly httpCode: number,
  ) {
    super(message);
  }
}
