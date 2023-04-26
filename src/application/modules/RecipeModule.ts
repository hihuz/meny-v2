import { RecipeController } from '@application/api/controllers/RecipeController';
import { RecipeService } from '@core/services/Recipe';
import { Module } from '@nestjs/common';
import { RecipeRepository } from '@infrastructure/adapter/prisma/repository/Recipe';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { PrismaClient } from '@infrastructure/adapter/prisma/client/PrismaClient';
import { UserTokens } from '@core/domain/di/tokens/User';
import { UserRepository } from '@infrastructure/adapter/prisma/repository/User';

@Module({
  controllers: [RecipeController],
  providers: [
    PrismaClient,
    { provide: UserTokens.UserPort, useClass: UserRepository },
    { provide: RecipeTokens.RecipePort, useClass: RecipeRepository },
    { provide: RecipeTokens.RecipeUseCase, useClass: RecipeService },
  ],
})
export class RecipeModule {}
