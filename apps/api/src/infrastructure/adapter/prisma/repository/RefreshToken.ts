import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../client/PrismaClient';
import {
  CreateRefreshTokenOptions,
  GetRefreshTokenOptions,
  RefreshTokenPort,
} from '@core/domain/ports/RefreshToken';
import { ListOptions } from '@core/common/persistence/ListOptions';
import { RefreshToken } from '@core/domain/entities/RefreshToken';
import { DeleteManyOptions } from '@core/common/persistence/DeleteManyOptions';
import { RefreshTokenMapper } from '../mapper/RefreshTokenMapper';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenPort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(options: CreateRefreshTokenOptions) {
    const refreshToken = await this.prisma.refreshToken.create({
      data: options,
    });

    return RefreshTokenMapper.toDomainEntity(refreshToken);
  }

  async get(options: GetRefreshTokenOptions) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: options,
    });

    if (refreshToken) {
      return RefreshTokenMapper.toDomainEntity(refreshToken);
    }

    return refreshToken;
  }

  async getList(options: ListOptions<RefreshToken>) {
    const [refreshTokens, count] = await this.prisma.$transaction([
      this.prisma.refreshToken.findMany(options),
      this.prisma.refreshToken.count(options),
    ]);

    return [RefreshTokenMapper.toDomainEntities(refreshTokens), count] as const;
  }

  async deleteMany(options: DeleteManyOptions<RefreshToken>) {
    const { count } = await this.prisma.refreshToken.deleteMany(options);

    return count;
  }
}
