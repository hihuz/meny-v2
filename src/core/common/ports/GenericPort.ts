import { ListOptions } from '../persistence/ListOptions';

export interface GenericPort<T> {
  getList?(options?: ListOptions): Promise<readonly [T[], number]>;

  get?(id: string): Promise<T>;

  create?(item: T): Promise<T>;

  update?(id: string, item: T): Promise<T>;

  delete?(id: string): Promise<T>;
}
