import { GenericPort } from '@core/common/ports/GenericPort';
import { Recipe } from '../entities/Recipe';
import { ListOptions } from '@core/common/persistence/ListOptions';

export interface RecipePort extends GenericPort<Recipe> {
  getList(options?: ListOptions): Promise<readonly [Recipe[], number]>;
}
