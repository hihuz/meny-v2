import { Recipe } from './recipe.entity';
import { Role } from './enums/role';
import { RefreshToken } from './refresh-token.entity';

export class User {
  id: number;
  email: string;
  name: string;
  password: string;
  recipes: Recipe[];
  roles: Role[];
  refreshTokens: RefreshToken[];
  createdAt: string;
  updatedAt: string;
}
