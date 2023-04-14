import { GenericPort } from '@core/common/ports/GenericPort';
import { User } from '../entities/User';

export interface UserPort extends GenericPort<User> {
  get(id: number): Promise<User | null>;
}
