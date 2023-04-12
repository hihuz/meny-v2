import { List } from '../dto/List';
import { ListOptions } from '../persistence/ListOptions';

export interface GenericUseCases<T> {
  getList?(options?: ListOptions): Promise<List<T>>;

  get?(id: string): Promise<T>;

  create?(item: T): Promise<T>;

  update?(id: string, item: T): Promise<T>;

  delete?(id: string): Promise<T>;
}
