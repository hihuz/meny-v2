import { ApiConfig } from '@infrastructure/config/Api';
import { RecipeModule } from './RecipeModule';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UserModule } from './UserModule';
import { AuthModule } from './AuthModule';

const DEFAULT_THROTTLER_TTL = 600; // 10 minutes
const DEFAULT_THROTTLER_LIMIT = 200;

@Module({
  imports: [
    AuthModule,
    RecipeModule,
    UserModule,
    ThrottlerModule.forRoot({
      ttl: ApiConfig.THROTTLER_TTL || DEFAULT_THROTTLER_TTL,
      limit: ApiConfig.THROTTLER_LIMIT || DEFAULT_THROTTLER_LIMIT,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RootModule {}
