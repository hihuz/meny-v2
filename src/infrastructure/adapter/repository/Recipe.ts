import { FindOptions } from '@core/common/persistence/options';
import { Recipe } from '@core/domain/entities/recipe';
import { RecipePort } from '@core/domain/ports/Recipe';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../prisma/client/PrismaClient';
import { Recipe as PrismaRecipe } from '@prisma/client';

@Injectable()
export class RecipeRepository implements RecipePort {
  constructor(private readonly prisma: PrismaClient) {}

  public async getList(options?: FindOptions): Promise<Recipe[]> {
    const recipes: PrismaRecipe[] = await this.prisma.recipe.findMany({
      skip: options?.offset,
      take: options?.limit,
    });

    return recipes;
  }
}
