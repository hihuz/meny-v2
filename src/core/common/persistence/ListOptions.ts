import { PickBy } from '../types/PickBy';

export interface ListOptions<T> {
  take?: number;

  skip?: number;

  // We are including only primitive types for now.
  // We will extend this type if we need to use arrays for our where clauses.
  where?: Partial<PickBy<T, string | number | boolean>>;
}
