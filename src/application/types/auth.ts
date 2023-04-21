import { User } from '@core/domain/entities/User';
import { Request } from 'express';

export type RequestWithUser = Request & {
  user: Pick<User, 'id' | 'email' | 'roles' | 'name'>;
};
