import { RefreshToken } from '@core/domain/entities/RefreshToken';
import { RefreshToken as PrismaRefreshToken } from '@prisma/client';

export class RefreshTokenMapper {
  public static toDomainEntity(
    prismaRefreshToken: PrismaRefreshToken,
  ): RefreshToken {
    return new RefreshToken(
      prismaRefreshToken.id,
      prismaRefreshToken.userId,
      prismaRefreshToken.jti,
      prismaRefreshToken.family,
      prismaRefreshToken.expiresAt,
      prismaRefreshToken.createdAt,
    );
  }

  public static toDomainEntities(
    prismaRefreshTokens: PrismaRefreshToken[],
  ): RefreshToken[] {
    return prismaRefreshTokens.map((prismaRefreshToken) =>
      this.toDomainEntity(prismaRefreshToken),
    );
  }
}
