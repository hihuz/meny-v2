import { Recipe } from './Recipe';
import { Role } from '../../common/enums/Role';
import { RefreshToken } from './RefreshToken';

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
