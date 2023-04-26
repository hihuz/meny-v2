import { ContextUser } from '@core/domain/entities/User';
import { List } from '../dto/List';
import { ListOptions } from '../dto/ListOptions';

export interface GenericUseCases<T> {
  getList?(options?: ListOptions): Promise<List<T>>;

  get?(id: number): Promise<T>;

  create?(item: Partial<T>, user?: ContextUser): Promise<T>;

  update?(item: Partial<T>, id: number): Promise<T>;

  delete?(id: number): Promise<T>;
}
