import { FindOptions } from '../persistence/options';

export abstract class GenericRepository<T> {
  abstract getList(options?: FindOptions): Promise<T[]>;

  abstract get(id: string): Promise<T>;

  abstract create(item: T): Promise<T>;

  abstract update(id: string, item: T): Promise<T>;

  abstract delete(id: string): Promise<T>;
}
