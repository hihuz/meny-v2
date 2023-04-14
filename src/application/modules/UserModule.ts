import { UserService } from '@core/services/User';
import { Module } from '@nestjs/common';
import { UserRepository } from '@infrastructure/adapter/prisma/repository/User';
import { UserTokens } from '@core/domain/di/tokens/User';
import { PrismaClient } from '@infrastructure/adapter/prisma/client/PrismaClient';
import { UserController } from '@application/api/controllers/UserController';

@Module({
  controllers: [UserController],
  providers: [
    PrismaClient,
    { provide: UserTokens.UserPort, useClass: UserRepository },
    { provide: UserTokens.UserUseCase, useClass: UserService },
  ],
})
export class UserModule {}
