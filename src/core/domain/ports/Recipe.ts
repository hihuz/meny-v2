import { GenericPort } from '@core/common/ports/GenericPort';
import { Recipe } from '../entities/Recipe';
import { ListOptions } from '@core/common/persistence/ListOptions';
import { UpsertRecipeDto } from '../dto/recipe/UpsertRecipeDto';
import { ContextUser } from '../entities/User';

export type GetRecipeOptions = Partial<Pick<Recipe, 'id'>>;

export type UpsertRecipeOptions = UpsertRecipeDto;

export interface RecipePort extends GenericPort<Recipe> {
  get(options: GetRecipeOptions): Promise<Recipe | null>;

  getList(options?: ListOptions<Recipe>): Promise<readonly [Recipe[], number]>;

  create(options: UpsertRecipeOptions, user: ContextUser): Promise<Recipe>;

  update(options: UpsertRecipeOptions, id: number): Promise<Recipe>;

  delete(id: number): Promise<Recipe>;
}
