import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../client/PrismaClient';
import {
  CreateUserOptions,
  GetUserOptions,
  UserPort,
} from '@core/domain/ports/User';
import { UserMapper } from '../mapper/UserMapper';

@Injectable()
export class UserRepository implements UserPort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(options: CreateUserOptions) {
    const user = await this.prisma.user.create({
      data: options,
    });

    return UserMapper.toDomainEntity(user);
  }

  async get(options: GetUserOptions) {
    const user = await this.prisma.user.findUnique({
      where: options,
    });

    if (user) {
      return UserMapper.toDomainEntity(user);
    }

    return user;
  }
}
