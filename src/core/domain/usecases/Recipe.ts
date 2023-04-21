import { GenericUseCases } from '@core/common/usecases/GenericUseCases';
import { ListOptions } from '@core/common/dto/ListOptions';
import { RecipeDtoList } from '../dto/recipe/RecipeDtoList';
import { RecipeDto } from '../dto/recipe/RecipeDto';

export interface RecipeUseCases extends GenericUseCases<RecipeDto> {
  getList(options?: ListOptions): Promise<RecipeDtoList>;
}
