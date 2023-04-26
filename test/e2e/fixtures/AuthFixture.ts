import { AuthTokens } from '@core/domain/di/tokens/Auth';
import { AuthUseCases } from '@core/domain/usecases/Auth';
import { TestingModule } from '@nestjs/testing';
import { AuthResultDto } from '@core/domain/dto/auth/AuthResultDto';
import { ApiConfig } from '@infrastructure/config/Api';
import { sign } from 'jsonwebtoken';

export class AuthFixture {
  constructor(private readonly testingModule: TestingModule) {}

  public async login(email: string, password: string): Promise<AuthResultDto> {
    const authUseCases: AuthUseCases = this.testingModule.get(
      AuthTokens.AuthUseCase,
    );

    const tokens = await authUseCases.login(email, password);

    return tokens;
  }

  public generateRefreshToken(
    payload: Record<string, any>,
    secret = ApiConfig.REFRESH_TOKEN_SECRET,
  ) {
    const refreshToken = sign(payload, secret);

    return refreshToken;
  }

  public generateAccessToken(
    payload: Record<string, any>,
    secret = ApiConfig.ACCESS_TOKEN_SECRET,
  ) {
    const accessToken = sign(payload, secret);

    return accessToken;
  }

  public static create(testingModule: TestingModule): AuthFixture {
    return new AuthFixture(testingModule);
  }
}
