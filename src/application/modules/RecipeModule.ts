import { RecipeController } from '@application/api/controllers/RecipeController';
import { RecipeService } from '@core/services/Recipe';
import { Module } from '@nestjs/common';
import { RecipeRepository } from '@infrastructure/adapter/repository/Recipe';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';

@Module({
  imports: [],
  controllers: [RecipeController],
  providers: [
    { provide: RecipeTokens.RecipePort, useClass: RecipeRepository },
    { provide: RecipeTokens.RecipeUseCase, useClass: RecipeService },
  ],
})
export class RecipeModule {}
