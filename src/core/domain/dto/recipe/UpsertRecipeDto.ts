import { RecipeType } from '@core/common/enums/RecipeType';
import { Season } from '@core/common/enums/Season';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class UpsertRecipeDto {
  @ApiProperty({
    required: false,
    example: 'Cassoulet',
    description: 'The name of the recipe',
  })
  @IsString()
  @IsOptional()
  public name?: string | null;

  @ApiProperty({
    required: false,
    example: 15,
    description:
      'The cooking time for the recipe in minutes. This is a general indicator and it should be specified further in the recipe steps.',
  })
  @IsInt()
  @IsOptional()
  public cooking?: number | null;

  @ApiProperty({
    required: false,
    example: 'An alternative is to use Rice instead of Pasta.',
    description: 'An additional note about the recipe.',
  })
  @IsString()
  @IsOptional()
  public note?: string | null;

  @ApiProperty({
    required: false,
    example: 'A delicious and comforting winter dish.',
    description: 'The main description of the recipe.',
  })
  @IsString()
  @IsOptional()
  public description?: string | null;

  @ApiProperty({
    required: false,
    example: 20,
    description:
      'The preparation time necessary for the recipe in minutes. This is a general indicator and it should be specified further in the recipe steps.',
  })
  @IsInt()
  @IsOptional()
  public preparation?: number | null;

  @ApiProperty({
    required: false,
    example: 2000,
    description: 'The average cost of the ingredients for the recipe in cents.',
  })
  @IsInt()
  @IsOptional()
  public price?: number | null;

  @ApiProperty({
    required: false,
    example: 2,
    description:
      'The expected number of servings with the provided ingredients.',
  })
  @IsInt()
  @IsOptional()
  public servings?: number | null;

  @ApiProperty({
    required: false,
    example: Season.Winter,
    default: Season.Unspecified,
    enum: Season,
    description: 'The best season to find fresh ingredients for this recipe.',
  })
  @IsEnum(Season)
  @IsOptional()
  public season?: `${Season}`;

  @ApiProperty({
    required: false,
    type: [String],
    example: ['Salt', 'Flour', 'Water'],
    description: 'The ingredients necessary to prepare the recipe.',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public ingredients?: string[];

  @ApiProperty({
    required: false,
    type: [String],
    example: ['Cut the vegetables', '???', 'Profit'],
    description: 'The steps to follow in order to prepare the recipe.',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public steps?: string[];

  @ApiProperty({
    required: false,
    example: RecipeType.Main,
    default: RecipeType.Unspecified,
    enum: RecipeType,
    description: 'The type of recipe.',
  })
  @IsEnum(RecipeType)
  @IsOptional()
  public type?: `${RecipeType}`;

  @ApiProperty({
    required: false,
    example: true,
    default: false,
    description: 'Is the recipe visible to others.',
  })
  @IsBoolean()
  @IsOptional()
  public visible?: boolean;
}
