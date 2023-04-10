import { GenericPort } from '@core/common/ports/GenericPort';
import { Recipe } from '../entities/recipe';
import { FindOptions } from '@core/common/persistence/options';

export interface RecipePort extends GenericPort<Recipe> {
  getList(options?: FindOptions): Promise<Recipe[]>;
}
