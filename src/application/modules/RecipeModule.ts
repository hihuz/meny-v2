import { RecipeController } from '@application/api/controllers/RecipeController';
import { RecipeService } from '@core/services/Recipe';
import { Module } from '@nestjs/common';
import { RecipeRepository } from '@infrastructure/adapter/prisma/repository/Recipe';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { PrismaClient } from '@infrastructure/adapter/prisma/client/PrismaClient';

@Module({
  controllers: [RecipeController],
  providers: [
    PrismaClient,
    { provide: RecipeTokens.RecipePort, useClass: RecipeRepository },
    { provide: RecipeTokens.RecipeUseCase, useClass: RecipeService },
  ],
})
export class RecipeModule {}
