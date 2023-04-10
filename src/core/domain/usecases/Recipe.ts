import { GenericUseCases } from '@core/common/usecases/GenericUseCases';
import { Recipe } from '../entities/recipe';
import { FindOptions } from '@core/common/persistence/options';

export interface RecipeUseCases extends GenericUseCases<Recipe> {
  getList(options?: FindOptions): Promise<Recipe[]>;
}
