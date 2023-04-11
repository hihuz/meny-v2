import { FindOptions } from '@core/common/persistence/options';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { Recipe } from '@core/domain/entities/recipe';
import { RecipePort } from '@core/domain/ports/Recipe';
import { RecipeUseCases } from '@core/domain/usecases/Recipe';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RecipeService implements RecipeUseCases {
  constructor(
    @Inject(RecipeTokens.RecipePort)
    private readonly recipePort: RecipePort,
  ) {}

  public async getList(options?: FindOptions): Promise<Recipe[]> {
    const recipes = await this.recipePort.getList(options);

    return recipes;
  }
}
