import { Controller, Get, Inject } from '@nestjs/common';
import { Recipe } from '@core/domain/entities/recipe';
import { RecipeUseCases } from '@core/domain/usecases/Recipe';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';

@Controller('recipes')
export class RecipeController {
  constructor(
    @Inject(RecipeTokens.RecipeUseCase)
    private readonly recipeUseCases: RecipeUseCases,
  ) {}

  @Get()
  getRecipes(): Promise<Recipe[]> {
    return this.recipeUseCases.getList();
  }
}
