import { RecipeModule } from './RecipeModule';
import { Module } from '@nestjs/common';

@Module({
  imports: [RecipeModule],
})
export class RootModule {}
