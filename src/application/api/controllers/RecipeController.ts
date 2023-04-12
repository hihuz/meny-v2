import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RecipeUseCases } from '@core/domain/usecases/Recipe';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { ApiResponse } from '@nestjs/swagger';
import { RecipeDtoList } from '@core/domain/dto/recipe/RecipeDtoList';
import { ListOptionsQueryDto } from '@core/common/dto/ListOptionsQueryDto';
import { PipeConfig } from './config/Pipe';

@Controller('recipes')
export class RecipeController {
  constructor(
    @Inject(RecipeTokens.RecipeUseCase)
    private readonly recipeUseCases: RecipeUseCases,
  ) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: RecipeDtoList })
  getRecipes(
    @Query(new ValidationPipe(PipeConfig.queryValidation))
    query: ListOptionsQueryDto,
  ): Promise<RecipeDtoList> {
    return this.recipeUseCases.getList(query);
  }
}
