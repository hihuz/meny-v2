import { FindOptions } from '@core/common/persistence/options';
import { Recipe } from '@core/domain/entities/recipe';
import { RecipePort } from '@core/domain/ports/Recipe';
import { RecipeUseCases } from '@core/domain/usecases/Recipe';

export class RecipeService implements RecipeUseCases {
  constructor(private readonly recipePort: RecipePort) {}

  public async getList(options?: FindOptions): Promise<Recipe[]> {
    const recipes = await this.recipePort.getList(options);
    return recipes;
  }
}
