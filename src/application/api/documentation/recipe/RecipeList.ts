import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from './Recipe';
import { List } from '../common/List';

export class RecipeList extends List<Recipe> {
  @ApiProperty({ type: [Recipe] })
  public data: Recipe[];

  @ApiProperty({ description: 'The total number of recipes.' })
  public count: number;
}
