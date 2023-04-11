import { List } from '../dto/List';
import { FindOptions } from '../persistence/options';

export interface GenericUseCases<T> {
  getList?(options?: FindOptions): Promise<List<T>>;

  get?(id: string): Promise<T>;

  create?(item: T): Promise<T>;

  update?(id: string, item: T): Promise<T>;

  delete?(id: string): Promise<T>;
}
