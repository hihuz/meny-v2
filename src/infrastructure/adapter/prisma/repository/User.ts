import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../client/PrismaClient';
import { UserPort } from '@core/domain/ports/User';

@Injectable()
export class UserRepository implements UserPort {
  constructor(private readonly prisma: PrismaClient) {}

  async get(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
}
