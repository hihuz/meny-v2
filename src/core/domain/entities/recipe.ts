import { RecipeType } from '../../common/enums/recipe-type';
import { Season } from '../../common/enums/season';

export class Recipe {
  id: number;
  userId: number;
  cooking?: number | null;
  description?: string | null;
  ingredients: string[];
  name?: string | null;
  note?: string | null;
  preparation?: number | null;
  price?: number | null;
  season: `${Season}`;
  servings?: number | null;
  steps: string[];
  type: `${RecipeType}`;
  createdAt: Date;
  updatedAt: Date;
}
