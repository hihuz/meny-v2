import { ListOptions } from '@core/common/persistence/ListOptions';
import {
  UpsertRecipeOptions,
  GetRecipeOptions,
  RecipePort,
} from '@core/domain/ports/Recipe';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../client/PrismaClient';
import { ApiConfig } from '@infrastructure/config/Api';
import { ContextUser } from '@core/domain/entities/User';
import { RecipeMapper } from '../mapper/RecipeMapper';
import { Recipe } from '@core/domain/entities/Recipe';

const DEFAULT_PAGE_SIZE = 50;

@Injectable()
export class RecipeRepository implements RecipePort {
  constructor(private readonly prisma: PrismaClient) {}

  public async get(options: GetRecipeOptions) {
    const recipe = await this.prisma.recipe.findUnique({
      where: options,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (recipe) {
      return RecipeMapper.toDomainEntity(recipe);
    }

    return recipe;
  }

  public async getList(options?: ListOptions<Recipe>) {
    const commonOptionsWithDefaults = {
      take: ApiConfig.DEFAULT_PAGE_SIZE || DEFAULT_PAGE_SIZE,
      ...options,
    };

    const findOptionsWithDefault = {
      ...commonOptionsWithDefaults,
      orderBy: [
        {
          id: 'desc' as const,
        },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    };

    const [recipes, count] = await this.prisma.$transaction([
      this.prisma.recipe.findMany(findOptionsWithDefault),
      this.prisma.recipe.count(commonOptionsWithDefaults),
    ]);

    return [RecipeMapper.toDomainEntities(recipes), count] as const;
  }

  public async create(options: UpsertRecipeOptions, user: ContextUser) {
    const persistedRecipe = await this.prisma.recipe.create({
      data: { ...options, userId: user.id },
    });

    const recipe = {
      ...persistedRecipe,
      user: {
        id: user.id,
        name: user.name,
      },
    };

    return RecipeMapper.toDomainEntity(recipe);
  }

  public async update(options: UpsertRecipeOptions, id: number) {
    const recipe = await this.prisma.recipe.update({
      data: options,
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return RecipeMapper.toDomainEntity(recipe);
  }

  public async delete(id: number) {
    const recipe = await this.prisma.recipe.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return RecipeMapper.toDomainEntity(recipe);
  }
}
