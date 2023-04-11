import { FindOptions } from '@core/common/persistence/options';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { RecipeDto } from '@core/domain/dto/recipe/RecipeDto';
import { RecipeDtoList } from '@core/domain/dto/recipe/RecipeDtoList';
import { RecipePort } from '@core/domain/ports/Recipe';
import { RecipeUseCases } from '@core/domain/usecases/Recipe';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RecipeService implements RecipeUseCases {
  constructor(
    @Inject(RecipeTokens.RecipePort)
    private readonly recipePort: RecipePort,
  ) {}

  public async getList(options?: FindOptions): Promise<RecipeDtoList> {
    const [recipes, count] = await this.recipePort.getList(options);

    return {
      data: RecipeDto.createListFromRecipes(recipes),
      count,
    };
  }
}
