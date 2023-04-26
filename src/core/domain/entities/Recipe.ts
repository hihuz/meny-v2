import { RecipeType } from '../../common/enums/RecipeType';
import { Season } from '../../common/enums/Season';
import { User } from './User';

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
  user: Pick<User, 'id' | 'name'>;
  visible: boolean;
}
