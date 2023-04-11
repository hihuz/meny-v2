import { ApiProperty } from '@nestjs/swagger';
import { RecipeDto } from './RecipeDto';
import { List } from '../../../common/dto/List';

export class RecipeDtoList extends List<RecipeDto> {
  @ApiProperty({ type: [RecipeDto] })
  public data: RecipeDto[];

  @ApiProperty({ description: 'The total number of recipes.' })
  public count: number;
}
