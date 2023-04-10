import { RecipeType } from '@core/common/enums/recipe-type';
import { Season } from '@core/common/enums/season';
import { ApiProperty } from '@nestjs/swagger';

export class Recipe {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public userId: number;

  @ApiProperty({
    required: false,
    example: 'Cassoulet',
    description: 'The name of a recipe',
  })
  public name?: string;

  @ApiProperty({
    required: false,
    example: 15,
    description:
      'The cooking time for a recipe in minutes. This is a general indicator and it should be specified further in the recipe steps.',
  })
  public cooking?: number;

  @ApiProperty({
    required: false,
    example: 'An alternative is to use Rice instead of Pasta.',
    description: 'An additional note about the recipe.',
  })
  public note?: string;

  @ApiProperty({
    required: false,
    example: 'A delicious and comforting winter dish.',
    description: 'The main description of a recipe.',
  })
  public description?: string;

  @ApiProperty({
    required: false,
    example: 20,
    description:
      'The preparation time necessary for a recipe in minutes. This is a general indicator and it should be specified further in the recipe steps.',
  })
  public preparation?: number;

  @ApiProperty({
    required: false,
    example: 2000,
    description: 'The average cost of the ingredients for a recipe in cents.',
  })
  public price?: number;

  @ApiProperty({
    required: false,
    example: 2,
    description:
      'The expected number of servings with the provided ingredients.',
  })
  public servings?: number;

  @ApiProperty({
    required: false,
    example: Season.Winter,
    default: Season.Unspecified,
    enum: Season,
    description: 'The best season to find fresh ingredients for this recipe.',
  })
  public season?: Season;

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
  public type?: RecipeType;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updatedAt: string;
}
