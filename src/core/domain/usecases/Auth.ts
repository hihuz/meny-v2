import { AuthResultDto } from '../dto/auth/AuthResultDto';
import { User } from '../entities/User';

export interface AuthUseCases {
  login(email: string, password: string): Promise<AuthResultDto>;

  refreshTokens(refreshToken: string): Promise<AuthResultDto>;

  validateUser(email: string, password: string): Promise<User>;
}
