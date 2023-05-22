import { User } from '@core/domain/entities/User';
import { User as PrismaUser, Recipe, RefreshToken } from '@prisma/client';
import { RecipeMapper } from './RecipeMapper';
import { RefreshTokenMapper } from './RefreshTokenMapper';

type PrismaUserWithRelations = PrismaUser & {
  recipes?: Recipe[];
  refreshTokens?: RefreshToken[];
};

export class UserMapper {
  public static toDomainEntity(prismaUser: PrismaUserWithRelations): User {
    const recipes = RecipeMapper.toDomainEntities(prismaUser.recipes || []);
    const refreshTokens = RefreshTokenMapper.toDomainEntities(
      prismaUser.refreshTokens || [],
    );

    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.password,
      prismaUser.roles,
      prismaUser.createdAt,
      prismaUser.updatedAt,
      recipes,
      refreshTokens,
    );
  }

  public static toDomainEntities(
    prismaUsers: PrismaUserWithRelations[],
  ): User[] {
    return prismaUsers.map((prismaUser) => this.toDomainEntity(prismaUser));
  }
}
