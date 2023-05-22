import { ListOptions } from '@core/common/dto/ListOptions';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { UpsertRecipeDto } from '@core/domain/dto/recipe/UpsertRecipeDto';
import { RecipeDto } from '@core/domain/dto/recipe/RecipeDto';
import { RecipeDtoList } from '@core/domain/dto/recipe/RecipeDtoList';
import { ContextUser } from '@core/domain/entities/User';
import { RecipePort } from '@core/domain/ports/Recipe';
import { RecipeUseCases } from '@core/domain/usecases/Recipe';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CoreAssert } from '@core/common/utils/assert/CoreAssert';

@Injectable()
export class RecipeService implements RecipeUseCases {
  constructor(
    @Inject(RecipeTokens.RecipePort)
    private readonly recipePort: RecipePort,
  ) {}

  async get(id: number): Promise<RecipeDto> {
    const recipe = CoreAssert.notEmpty(
      await this.recipePort.get({ id }),
      new NotFoundException(),
    );

    return RecipeDto.createFromRecipe(recipe);
  }

  public async getList(options?: ListOptions): Promise<RecipeDtoList> {
    const [recipes, count] = await this.recipePort.getList(options);

    return {
      data: RecipeDto.createListFromRecipes(recipes),
      count,
    };
  }

  public async create(
    payload: UpsertRecipeDto,
    user: ContextUser,
  ): Promise<RecipeDto> {
    const recipe = await this.recipePort.create(payload, user);

    return RecipeDto.createFromRecipe(recipe);
  }

  public async update(
    payload: UpsertRecipeDto,
    id: number,
  ): Promise<RecipeDto> {
    const recipe = await this.recipePort.update(payload, id);

    return RecipeDto.createFromRecipe(recipe);
  }

  public async delete(id: number): Promise<RecipeDto> {
    const recipe = await this.recipePort.delete(id);

    return RecipeDto.createFromRecipe(recipe);
  }
}
