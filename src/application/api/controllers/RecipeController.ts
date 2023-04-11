import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { RecipeUseCases } from '@core/domain/usecases/Recipe';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { ApiResponse } from '@nestjs/swagger';
import { RecipeDtoList } from '@core/domain/dto/recipe/RecipeDtoList';

@Controller('recipes')
export class RecipeController {
  constructor(
    @Inject(RecipeTokens.RecipeUseCase)
    private readonly recipeUseCases: RecipeUseCases,
  ) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: RecipeDtoList })
  getRecipes(): Promise<RecipeDtoList> {
    return this.recipeUseCases.getList();
  }
}
