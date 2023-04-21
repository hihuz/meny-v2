import { Logger, Module } from '@nestjs/common';
import { AuthService } from '@core/services/Auth';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@application/api/controllers/AuthController';
import { UserTokens } from '@core/domain/di/tokens/User';
import { UserRepository } from '@infrastructure/adapter/prisma/repository/User';
import { RefreshTokenTokens } from '@core/domain/di/tokens/RefreshToken';
import { RefreshTokenRepository } from '@infrastructure/adapter/prisma/repository/RefreshToken';
import { PrismaClient } from '@infrastructure/adapter/prisma/client/PrismaClient';
import { AuthTokens } from '@core/domain/di/tokens/Auth';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    Logger,
    PrismaClient,
    { provide: AuthTokens.AuthUseCase, useClass: AuthService },
    { provide: UserTokens.UserPort, useClass: UserRepository },
    {
      provide: RefreshTokenTokens.RefreshTokenPort,
      useClass: RefreshTokenRepository,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
