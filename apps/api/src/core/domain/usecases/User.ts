import { GenericUseCases } from '@core/common/usecases/GenericUseCases';
import { UserDto } from '../dto/user/UserDto';
import { CreateUserDto } from '../dto/user/CreateUserDto';

export interface UserUseCases extends GenericUseCases<UserDto> {
  hashPassword(password: string): Promise<string>;

  create(payload: CreateUserDto): Promise<UserDto>;

  get(id: number): Promise<UserDto>;
}
