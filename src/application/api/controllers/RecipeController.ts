import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RecipeUseCases } from '@core/domain/usecases/Recipe';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { ApiResponse } from '@nestjs/swagger';
import { RecipeDtoList } from '@core/domain/dto/recipe/RecipeDtoList';
import { ListOptionsQueryDto } from '@core/common/dto/ListOptionsQueryDto';
import { PipeConfig } from './config/Pipe';
import { RecipeDto } from '@core/domain/dto/recipe/RecipeDto';
import { UpsertRecipeDto } from '@core/domain/dto/recipe/UpsertRecipeDto';
import { RequestWithUser } from '@application/types/auth';
import { Roles } from '../decorators/Roles';
import { Role } from '@core/common/enums/Role';
import { RecipeOwnerGuard } from '../guards/RecipeOwnerGuard';

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

  @Post()
  @Roles(Role.Author)
  @ApiResponse({ status: HttpStatus.CREATED, type: RecipeDto })
  createRecipe(
    @Body(new ValidationPipe(PipeConfig.bodyValidation)) body: UpsertRecipeDto,
    @Req() request: RequestWithUser,
  ) {
    return this.recipeUseCases.create(body, request.user);
  }

  @Patch(':id')
  @UseGuards(RecipeOwnerGuard)
  @Roles(Role.Author)
  @ApiResponse({ status: HttpStatus.OK, type: RecipeDto })
  updateRecipe(
    @Body(new ValidationPipe(PipeConfig.bodyValidation)) body: UpsertRecipeDto,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.recipeUseCases.update(body, id);
  }

  @Delete(':id')
  @UseGuards(RecipeOwnerGuard)
  @Roles(Role.Author)
  @ApiResponse({ status: HttpStatus.OK, type: RecipeDto })
  deleteRecipe(@Param('id', new ParseIntPipe()) id: number) {
    return this.recipeUseCases.delete(id);
  }
}
