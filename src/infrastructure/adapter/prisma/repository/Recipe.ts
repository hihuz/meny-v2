import { FindOptions } from '@core/common/persistence/options';
import { RecipePort } from '@core/domain/ports/Recipe';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../client/PrismaClient';
import { ApiConfig } from '@infrastructure/config/Api';

const DEFAULT_PAGE_SIZE = 50;

@Injectable()
export class RecipeRepository implements RecipePort {
  constructor(private readonly prisma: PrismaClient) {}

  public async getList(options?: FindOptions) {
    const commonOptionsWithDefaults = {
      take: ApiConfig.DEFAULT_PAGE_SIZE || DEFAULT_PAGE_SIZE,
      ...options,
    };

    const findOptionsWithDefault = {
      ...commonOptionsWithDefaults,
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
