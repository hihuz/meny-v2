import { ApiConfig } from './Api';

export class AuthConfig {
  public static readonly accessToken = {
    secret: ApiConfig.ACCESS_TOKEN_SECRET,
    expiresIn: ApiConfig.ACCESS_TOKEN_TTL,
    algorithm: 'HS256' as const,
  };

  public static readonly refreshToken = {
    secret: ApiConfig.REFRESH_TOKEN_SECRET,
    expiresIn: ApiConfig.REFRESH_TOKEN_TTL,
    algorithm: 'HS256' as const,
  };
}
