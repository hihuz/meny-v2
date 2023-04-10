import { FindOptions } from '../persistence/options';

export interface GenericPort<T> {
  getList?(options?: FindOptions): Promise<T[]>;

  get?(id: string): Promise<T>;

  create?(item: T): Promise<T>;

  update?(id: string, item: T): Promise<T>;

  delete?(id: string): Promise<T>;
}
