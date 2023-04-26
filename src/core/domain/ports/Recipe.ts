import { GenericPort } from '@core/common/ports/GenericPort';
import { Recipe } from '../entities/Recipe';
import { ListOptions } from '@core/common/persistence/ListOptions';
export type GetRecipeOptions = Partial<Pick<Recipe, 'id'>>;


export interface RecipePort extends GenericPort<Recipe> {
  get(options: GetRecipeOptions): Promise<Recipe | null>;

  getList(options?: ListOptions<Recipe>): Promise<readonly [Recipe[], number]>;
}
