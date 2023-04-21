import { CoreAssert } from '@core/common/utils/assert/CoreAssert';
import { UserTokens } from '@core/domain/di/tokens/User';
import { CreateUserDto } from '@core/domain/dto/user/CreateUserDto';
import { UserDto } from '@core/domain/dto/user/UserDto';
import { UserPort } from '@core/domain/ports/User';
import { UserUseCases } from '@core/domain/usecases/User';
import { ApiConfig } from '@infrastructure/config/Api';
import {
  NotFoundException,
  Inject,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { hash } from 'bcrypt';

const DEFAULT_SALT_ROUNDS = 10;

const ROLES = ['AUTHOR' as const];

@Injectable()
export class UserService implements UserUseCases {
  constructor(
    @Inject(UserTokens.UserPort)
    private readonly userPort: UserPort,
  ) {}

  async get(id: number): Promise<UserDto> {
    const user = CoreAssert.notEmpty(
      await this.userPort.get({ id }),
      new NotFoundException(),
    );

    return UserDto.createFromUser(user);
  }

  // TODO: add email confirmation logic
  async create(payload: CreateUserDto): Promise<UserDto> {
    const email = payload.email.toLowerCase();

    const matchingUser = await this.userPort.get({ email });

    if (matchingUser) {
      throw new ConflictException('User already exists');
    }

    const password = await hash(
      payload.password,
      ApiConfig.SALT_ROUNDS || DEFAULT_SALT_ROUNDS,
    );

    const user = await this.userPort.create({
      email,
      password,
      roles: ROLES,
      name: payload.name || email,
    });

    return UserDto.createFromUser(user, { include: ['email'] });
  }
}
