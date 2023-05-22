import { Recipe } from '@core/domain/entities/Recipe';
import { Recipe as PrismaRecipe } from '@prisma/client';

type PrismaRecipeWithRelations = PrismaRecipe & {
  user?: { id: number; name: string };
};

export class RecipeMapper {
  public static toDomainEntity(
    prismaRecipe: PrismaRecipeWithRelations,
  ): Recipe {
    return new Recipe(
      prismaRecipe.id,
      prismaRecipe.userId,
      prismaRecipe.ingredients,
      prismaRecipe.season,
      prismaRecipe.type,
      prismaRecipe.steps,
      prismaRecipe.createdAt,
      prismaRecipe.updatedAt,
      prismaRecipe.visible,
      prismaRecipe.user,
      prismaRecipe.cooking,
      prismaRecipe.description,
      prismaRecipe.name,
      prismaRecipe.note,
      prismaRecipe.preparation,
      prismaRecipe.price,
      prismaRecipe.servings,
    );
  }

  public static toDomainEntities(
    prismaRecipes: PrismaRecipeWithRelations[],
  ): Recipe[] {
    return prismaRecipes.map((prismaRecipe) =>
      this.toDomainEntity(prismaRecipe),
    );
  }
}
