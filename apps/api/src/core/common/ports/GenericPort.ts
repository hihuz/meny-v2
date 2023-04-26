import { ListOptions } from '../persistence/ListOptions';
import { DeleteManyOptions } from '../persistence/DeleteManyOptions';
import { ContextUser } from '@core/domain/entities/User';

export interface GenericPort<T> {
  getList?(options?: ListOptions<T>): Promise<readonly [T[], number]>;

  get?(options: Partial<Pick<T, keyof T>>): Promise<T | null>;

  create?(item: Partial<T>, user?: ContextUser): Promise<T>;

  update?(item: Partial<T>, id: number): Promise<T>;

  delete?(id: number): Promise<T>;

  deleteMany?(options?: DeleteManyOptions<T>): Promise<number>;
}
