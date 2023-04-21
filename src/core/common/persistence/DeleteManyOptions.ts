import { PickBy } from '../types/PickBy';

export interface DeleteManyOptions<T> {
  where?: Partial<PickBy<T, string | number | boolean>>;
}
