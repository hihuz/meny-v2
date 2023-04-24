import { ListOptions } from '../persistence/ListOptions';
import { DeleteManyOptions } from '../persistence/DeleteManyOptions';

export interface GenericPort<T> {
  getList?(options?: ListOptions<T>): Promise<readonly [T[], number]>;

  get?(options: Partial<Pick<T, keyof T>>): Promise<T | null>;

  create?(item: Partial<T>): Promise<T>;

  update?(id: number, item: T): Promise<T>;

  delete?(id: number): Promise<T>;

  deleteMany?(options?: DeleteManyOptions<T>): Promise<number>;
}
