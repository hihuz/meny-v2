import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { Recipe } from '@core/domain/entities/recipe';
import { RecipeUseCases } from '@core/domain/usecases/Recipe';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { ApiResponse } from '@nestjs/swagger';
import { RecipeList } from '../documentation/recipe/RecipeList';

@Controller('recipes')
export class RecipeController {
  constructor(
    @Inject(RecipeTokens.RecipeUseCase)
    private readonly recipeUseCases: RecipeUseCases,
  ) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: RecipeList })
  getRecipes(): Promise<Recipe[]> {
    return this.recipeUseCases.getList();
  }
}
