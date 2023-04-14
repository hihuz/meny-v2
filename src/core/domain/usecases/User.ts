import { GenericUseCases } from '@core/common/usecases/GenericUseCases';
import { UserDto } from '../dto/user/UserDto';

export interface UserUseCases extends GenericUseCases<UserDto> {
  get(id: number): Promise<UserDto>;
}
