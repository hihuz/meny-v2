import { CoreAssert } from '@core/common/utils/assert/CoreAssert';
import { UserTokens } from '@core/domain/di/tokens/User';
import { UserDto } from '@core/domain/dto/user/UserDto';
import { UserPort } from '@core/domain/ports/User';
import { UserUseCases } from '@core/domain/usecases/User';
import { NotFoundException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService implements UserUseCases {
  constructor(
    @Inject(UserTokens.UserPort)
    private readonly userPort: UserPort,
  ) {}

  async get(id: number): Promise<UserDto> {
    const user = CoreAssert.notEmpty(
      await this.userPort.get(id),
      new NotFoundException(),
    );

    return UserDto.createFromUser(user);
  }
}
