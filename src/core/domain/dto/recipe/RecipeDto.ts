import { RecipeType } from '@core/common/enums/recipe-type';
import { Season } from '@core/common/enums/season';
import { Recipe } from '@core/domain/entities/recipe';
import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

class RecipeAuthorDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    description: "The name of the recipe's author",
    example: 'Shackleton',
  })
  name: string;
}

export class RecipeDto {
  @ApiProperty()
  public id: number;

  @ApiProperty({ type: RecipeAuthorDto })
  public author: RecipeAuthorDto;

  @ApiProperty({
    required: false,
    example: 'Cassoulet',
    description: 'The name of a recipe',
  })
  public name?: string | null;

  @ApiProperty({
    required: false,
    example: 15,
    description:
      'The cooking time for a recipe in minutes. This is a general indicator and it should be specified further in the recipe steps.',
  })
  public cooking?: number | null;

  @ApiProperty({
    required: false,
    example: 'An alternative is to use Rice instead of Pasta.',
    description: 'An additional note about the recipe.',
  })
  public note?: string | null;

  @ApiProperty({
    required: false,
    example: 'A delicious and comforting winter dish.',
    description: 'The main description of a recipe.',
  })
  public description?: string | null;

  @ApiProperty({
    required: false,
    example: 20,
    description:
      'The preparation time necessary for a recipe in minutes. This is a general indicator and it should be specified further in the recipe steps.',
  })
  public preparation?: number | null;

  @ApiProperty({
    required: false,
    example: 2000,
    description: 'The average cost of the ingredients for a recipe in cents.',
  })
  public price?: number | null;

  @ApiProperty({
    required: false,
    example: 2,
    description:
      'The expected number of servings with the provided ingredients.',
  })
  public servings?: number | null;

  @ApiProperty({
    required: false,
    example: Season.Winter,
    default: Season.Unspecified,
    enum: Season,
    description: 'The best season to find fresh ingredients for this recipe.',
  })
  public season: `${Season}`;

  @ApiProperty({
    type: [String],
    example: ['Salt', 'Flour', 'Water'],
    description: 'The ingredients necessary to prepare a recipe.',
  })
  public ingredients: string[];

  @ApiProperty({
    type: [String],
    example: ['Cut the vegetables', '???', 'Profit'],
    description: 'The steps to follow in order to prepare a recipe.',
  })
  public steps: string[];

  @ApiProperty({
    required: false,
    example: RecipeType.Main,
    default: RecipeType.Unspecified,
    enum: RecipeType,
    description: 'The type of recipe.',
  })
  public type: `${RecipeType}`;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updatedAt: string;

  public static createFromRecipe(recipe: Recipe): RecipeDto {
    const { userId: _userId, user, ...recipeRest } = recipe;

    const dto = plainToInstance(RecipeDto, recipeRest);

    dto.author = user;

    dto.createdAt = recipe.createdAt.toISOString();
    dto.updatedAt = recipe.updatedAt.toISOString();

    return dto;
  }

  public static createListFromRecipes(recipes: Recipe[]): RecipeDto[] {
    return recipes.map(this.createFromRecipe);
  }
}
