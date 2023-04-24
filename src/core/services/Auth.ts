import { Role } from '@core/common/enums/Role';
import { CoreAssert } from '@core/common/utils/assert/CoreAssert';
import { RefreshTokenTokens } from '@core/domain/di/tokens/RefreshToken';
import { UserTokens } from '@core/domain/di/tokens/User';
import { User } from '@core/domain/entities/User';
import { RefreshTokenPort } from '@core/domain/ports/RefreshToken';
import { UserPort } from '@core/domain/ports/User';
import { RefreshTokenPayload } from '@core/domain/types/auth';
import { AuthUseCases } from '@core/domain/usecases/Auth';
import { ApiConfig } from '@infrastructure/config/Api';
import { AuthConfig } from '@infrastructure/config/Auth';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DateTime } from 'luxon';
import { v4 } from 'uuid';
import { compare } from 'bcrypt';

const TOKEN_TYPE = 'Bearer';

@Injectable()
export class AuthService implements AuthUseCases {
  constructor(
    @Inject(UserTokens.UserPort)
    private readonly userPort: UserPort,
    @Inject(RefreshTokenTokens.RefreshTokenPort)
    private readonly refreshTokenPort: RefreshTokenPort,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  /**
   * Invalidate a family of refresh tokens if reuse has been detected.
   *
   * If another valid token from the same family exists, the family is
   * considered to be compromised and we invalidate all corresponding tokens.
   *
   * The user will then have to login again.
   *
   * @see https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation#automatic-reuse-detection
   * @param refreshToken the payload of the refresh token that is no longer valid
   */
  private async removeRefreshTokenFamilyIfApplicable(
    refreshToken: RefreshTokenPayload,
  ) {
    const results = await this.refreshTokenPort.getList({
      where: { family: refreshToken.family },
    });

    if (results[1] > 0) {
      this.logger.error('Compromised Refresh Token Family, removing', {
        refreshToken,
      });

      await this.refreshTokenPort.deleteMany({
        where: { family: refreshToken.family },
      });
    }
  }

  private async validateRefreshToken(refreshToken: RefreshTokenPayload) {
    const validRefreshToken = await this.refreshTokenPort.get({
      jti: refreshToken.jti,
    });

    if (!validRefreshToken) {
      await this.removeRefreshTokenFamilyIfApplicable(refreshToken);

      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }

  private async getUserRoles(id: number) {
    const user = CoreAssert.notEmpty(
      await this.userPort.get({ id }),
      new NotFoundException(),
    );

    return user.roles;
  }

  private async generateAccessToken(payload: {
    sub: number;
    roles: `${Role}`[];
  }): Promise<string> {
    const accessToken = await this.jwtService.signAsync(
      payload,
      AuthConfig.accessToken,
    );

    return accessToken;
  }

  private async saveRefreshToken(payload: {
    userId: number;
    jti: string;
    family: string;
  }) {
    const expiresAt = DateTime.utc()
      .plus({
        seconds: ApiConfig.REFRESH_TOKEN_TTL,
      })
      .toJSDate();

    await this.refreshTokenPort.create({ ...payload, expiresAt });
  }

  private async createRefreshToken(payload: {
    sub: number;
    family?: string;
  }): Promise<string> {
    const family = payload.family || v4();

    const jti = v4();

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti, family },
      AuthConfig.refreshToken,
    );

    await this.saveRefreshToken({
      userId: payload.sub,
      jti,
      family,
    });

    return refreshToken;
  }

  private async rotateRefreshToken(
    refreshToken: RefreshTokenPayload,
  ): Promise<string> {
    await this.refreshTokenPort.deleteMany({
      where: { jti: refreshToken.jti },
    });

    const newRefreshToken = await this.createRefreshToken({
      sub: refreshToken.sub,
      family: refreshToken.family,
    });

    return newRefreshToken;
  }

  public async validateUser(email: string, password: string): Promise<User> {
    const lowercaseEmail = email.toLowerCase();

    const user = await this.userPort.get({
      email: lowercaseEmail,
    });

    if (user) {
      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
        return user;
      }
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  /**
   * Use a refresh token to generate a new access_token / refresh_token pair.
   *
   * It includes a refresh token rotation mechanism: a refresh token can only
   * be used once to generate new tokens, and is invalidated in the process.
   *
   * @param refreshToken the refresh token to use to generate a new set of tokens
   * @returns a new set of tokens
   */
  public async refreshTokens(refreshToken: string) {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        AuthConfig.refreshToken,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    await this.validateRefreshToken(payload);

    const roles = await this.getUserRoles(payload.sub);

    const accessToken = await this.generateAccessToken({
      sub: payload.sub,
      roles,
    });

    const newRefreshToken = await this.rotateRefreshToken(payload);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      token_type: TOKEN_TYPE,
    };
  }

  public async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = { sub: user.id, roles: user.roles };

    const accessToken = await this.generateAccessToken(payload);

    const refreshToken = await this.createRefreshToken({ sub: payload.sub });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: TOKEN_TYPE,
    };
  }
}
