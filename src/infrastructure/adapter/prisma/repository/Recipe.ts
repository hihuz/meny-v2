import { ListOptions } from '@core/common/persistence/ListOptions';
import { RecipePort } from '@core/domain/ports/Recipe';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../client/PrismaClient';
import { ApiConfig } from '@infrastructure/config/Api';
import { Recipe } from '@core/domain/entities/Recipe';

const DEFAULT_PAGE_SIZE = 50;

@Injectable()
export class RecipeRepository implements RecipePort {
  constructor(private readonly prisma: PrismaClient) {}

  public async getList(
    options?: ListOptions<Recipe>,
  ): Promise<readonly [Recipe[], number]> {
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

    return [recipes, count] as const;
  }
}
