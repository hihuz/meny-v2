import { ListOptions } from '../persistence/ListOptions';

export interface GenericPort<T> {
  getList?(options?: ListOptions<T>): Promise<readonly [T[], number]>;

  get?(options: Partial<Pick<T, keyof T>>): Promise<T | null>;

  create?(item: Partial<T>): Promise<T>;

  update?(id: number, item: T): Promise<T>;

  delete?(id: number): Promise<T>;
}
