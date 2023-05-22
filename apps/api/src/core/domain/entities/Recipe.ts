import { RecipeType } from '../../common/enums/RecipeType';
import { Season } from '../../common/enums/Season';
import { User } from './User';

export class Recipe {
  constructor(
    public id: number,
    public userId: number,
    public ingredients: string[],
    public season: `${Season}`,
    public type: `${RecipeType}`,
    public steps: string[],
    public createdAt: Date,
    public updatedAt: Date,
    public visible: boolean,
    public user?: Pick<User, 'id' | 'name'>,
    public cooking?: number | null,
    public description?: string | null,
    public name?: string | null,
    public note?: string | null,
    public preparation?: number | null,
    public price?: number | null,
    public servings?: number | null,
  ) {}
}
