/* eslint-disable @typescript-eslint/no-unused-vars */
export class DatabaseClient<T> {
  getPool(): T {
    throw new Error('Method not implemented.');
  }

  startTransaction() {
    throw new Error('Method not implemented.');
  }

  commitTransaction(client: any) {
    throw new Error('Method not implemented.');
  }

  rollbackTransaction(client: any) {
    throw new Error('Method not implemented.');
  }
}

export const DATABASE_CLIENT = 'DATABASE_CLIENT';
