import { FindOptions } from '@core/common/persistence/options';
import { RecipePort } from '@core/domain/ports/Recipe';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../client/PrismaClient';

@Injectable()
export class RecipeRepository implements RecipePort {
  constructor(private readonly prisma: PrismaClient) {}

  public async getList(options?: FindOptions) {
    const [recipes, count] = await this.prisma.$transaction([
      this.prisma.recipe.findMany(options),
      this.prisma.recipe.count(options),
    ]);

    return [recipes, count] as const;
  }
}
