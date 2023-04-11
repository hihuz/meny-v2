import { GenericUseCases } from '@core/common/usecases/GenericUseCases';
import { FindOptions } from '@core/common/persistence/options';
import { RecipeDtoList } from '../dto/recipe/RecipeDtoList';
import { RecipeDto } from '../dto/recipe/RecipeDto';

export interface RecipeUseCases extends GenericUseCases<RecipeDto> {
  getList(options?: FindOptions): Promise<RecipeDtoList>;
}
