import { Recipe } from './Recipe';
import { Role } from '../../common/enums/Role';
import { RefreshToken } from './RefreshToken';

export class User {
  constructor(
    public id: number,
    public email: string,
    public name: string,
    public password: string,
    public roles: `${Role}`[],
    public createdAt: Date,
    public updatedAt: Date,
    public recipes?: Recipe[],
    public refreshTokens?: RefreshToken[],
  ) {}
}

export type ContextUser = Pick<User, 'id' | 'email' | 'roles' | 'name'>;
