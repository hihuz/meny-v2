import { List } from '../dto/List';
import { ListOptions } from '../persistence/ListOptions';

export interface GenericUseCases<T> {
  getList?(options?: ListOptions): Promise<List<T>>;

  get?(id: number): Promise<T>;

  create?(item: T): Promise<T>;

  update?(id: number, item: T): Promise<T>;

  delete?(id: number): Promise<T>;
}
