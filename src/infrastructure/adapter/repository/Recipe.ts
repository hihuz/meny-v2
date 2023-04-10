import { FindOptions } from '@core/common/persistence/options';
import { RecipeType } from '@core/domain/entities/enums/recipe-type';
import { Season } from '@core/domain/entities/enums/season';
import { Recipe } from '@core/domain/entities/recipe';
import { RecipePort } from '@core/domain/ports/Recipe';

export class RecipeRepository implements RecipePort {
  public async getList(options?: FindOptions): Promise<Recipe[]> {
    // TODO: Fetch from db once it has been properly setup and data has been imported
    return [
      {
        id: 1,
        userId: 1,
        cooking: 10,
        description: 'description',
        ingredients: ['ingredient'],
        name: 'Name',
        note: 'Note',
        preparation: 15,
        price: 1000,
        season: Season.Unspecified,
        servings: 2,
        steps: ['Step'],
        type: RecipeType.Unspecified,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ];
  }
}
