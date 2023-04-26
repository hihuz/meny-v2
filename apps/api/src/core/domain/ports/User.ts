import { GenericPort } from '@core/common/ports/GenericPort';
import { User } from '../entities/User';

export type GetUserOptions = Partial<Pick<User, 'id' | 'email'>>;

export type CreateUserOptions = Pick<
  User,
  'email' | 'password' | 'name' | 'roles'
>;

export interface UserPort extends GenericPort<User> {
  get(options: GetUserOptions): Promise<User | null>;

  create(options: CreateUserOptions): Promise<User>;
}
