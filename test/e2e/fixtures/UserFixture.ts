import { UserTokens } from '@core/domain/di/tokens/User';
import { UserPort } from '@core/domain/ports/User';
import { UserUseCases } from '@core/domain/usecases/User';
import { TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { v4 } from 'uuid';

export const DEFAULT_PASSWORD = '1234';

export class UserFixture {
  constructor(private readonly testingModule: TestingModule) {}

  public async insertOne(payload: Partial<User> = {}): Promise<User> {
    const userRepository: UserPort = this.testingModule.get(
      UserTokens.UserPort,
    );
    const userUseCases: UserUseCases = this.testingModule.get(
      UserTokens.UserUseCase,
    );

    const name = payload.name || 'User';
    const email = payload.email || `${v4()}@email.com`;
    const roles = payload.roles || ['AUTHOR'];

    const password = await userUseCases.hashPassword(
      payload.password || DEFAULT_PASSWORD,
    );

    const user = await userRepository.create({
      roles,
      email,
      password,
      name,
    });

    return user;
  }

  public static create(testingModule: TestingModule): UserFixture {
    return new UserFixture(testingModule);
  }
}
