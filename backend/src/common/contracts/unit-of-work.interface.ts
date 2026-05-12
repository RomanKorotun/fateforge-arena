export interface IUnitOfWork<TTx = unknown> {
  transaction<T>(fn: (tx: TTx) => Promise<T>): Promise<T>;
}
