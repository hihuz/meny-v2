import { GenericUseCases } from '@core/common/usecases/GenericUseCases';
import { ListOptions } from '@core/common/dto/ListOptions';
import { RecipeDtoList } from '../dto/recipe/RecipeDtoList';
import { RecipeDto } from '../dto/recipe/RecipeDto';
import { UpsertRecipeDto } from '../dto/recipe/UpsertRecipeDto';
import { ContextUser } from '../entities/User';

export interface RecipeUseCases extends GenericUseCases<RecipeDto> {
  getList(options?: ListOptions): Promise<RecipeDtoList>;

  create(payload: UpsertRecipeDto, user: ContextUser): Promise<RecipeDto>;

  update(payload: UpsertRecipeDto, id: number): Promise<RecipeDto>;

  delete(id: number): Promise<RecipeDto>;
}
