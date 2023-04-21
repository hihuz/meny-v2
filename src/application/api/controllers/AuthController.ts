import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { AuthUseCases } from '@core/domain/usecases/Auth';

import { LoginInputDto } from '@core/domain/dto/auth/LoginInputDto';
import { ApiResponse } from '@nestjs/swagger';
import { AuthResultDto } from '@core/domain/dto/auth/AuthResultDto';
import { RefreshTokenDto } from '@core/domain/dto/auth/RefreshTokensDto';
import { AuthTokens } from '@core/domain/di/tokens/Auth';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthTokens.AuthUseCase)
    private authUseCases: AuthUseCases,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: AuthResultDto })
  login(@Body(new ValidationPipe()) body: LoginInputDto) {
    return this.authUseCases.login(body.email, body.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: AuthResultDto })
  refreshTokens(@Body(new ValidationPipe()) { refreshToken }: RefreshTokenDto) {
    return this.authUseCases.refreshTokens(refreshToken);
  }
}
