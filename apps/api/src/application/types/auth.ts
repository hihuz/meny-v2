import { ContextUser } from '@core/domain/entities/User';
import { Request } from 'express';

export type RequestWithUser = Request & {
  user: ContextUser;
};
