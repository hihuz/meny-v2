import { Recipe } from './recipe';
import { Role } from './enums/role';
import { RefreshToken } from './refresh-token';

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
