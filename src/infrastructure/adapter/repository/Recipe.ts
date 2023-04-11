import { FindOptions } from '@core/common/persistence/options';
import { RecipePort } from '@core/domain/ports/Recipe';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../prisma/client/PrismaClient';

@Injectable()
export class RecipeRepository implements RecipePort {
  constructor(private readonly prisma: PrismaClient) {}

  public async getList(options?: FindOptions) {
    const findOptions = {
      skip: options?.offset,
      take: options?.limit,
    };

    const [recipes, count] = await this.prisma.$transaction([
      this.prisma.recipe.findMany(findOptions),
      this.prisma.recipe.count(findOptions),
    ]);

    return [recipes, count] as const;
  }
}
