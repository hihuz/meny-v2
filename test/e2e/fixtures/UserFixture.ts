import { PrismaClient, User } from '@prisma/client';
import { v4 } from 'uuid';

export const DEFAULT_PASSWORD = '1234';

export class UserFixture {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async insertOne(payload: Partial<User> = {}): Promise<User> {
    const name = payload.name || 'User';
    const email = payload.email || `${v4()}@email.com`;
    const roles = payload.roles || ['AUTHOR'];
    const password = payload.password || DEFAULT_PASSWORD;

    const user = await this.prismaClient.user.create({
      data: {
        roles,
        email,
        password,
        name,
      },
    });

    return user;
  }

  public static create(prismaClient: PrismaClient): UserFixture {
    return new UserFixture(prismaClient);
  }
}
