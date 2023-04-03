import { RecipeType } from './enums/recipe-type';
import { Season } from './enums/season';

export class Recipe {
  id: number;
  userId: number;
  cooking?: number;
  description?: string;
  ingredients: string[];
  name?: string;
  note?: string;
  preparation?: number;
  price?: number;
  season?: Season;
  servings?: number;
  steps: string[];
  type?: RecipeType;
  createdAt: string;
  updatedAt: string;
}
