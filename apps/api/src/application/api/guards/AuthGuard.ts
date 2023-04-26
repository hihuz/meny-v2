import { RequestWithUser } from '@application/types/auth';
import { CoreAssert } from '@core/common/utils/assert/CoreAssert';
import { UserTokens } from '@core/domain/di/tokens/User';
import { UserPort } from '@core/domain/ports/User';
import { AccessTokenPayload } from '@core/domain/types/auth';
import { AuthConfig } from '@infrastructure/config/Auth';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(UserTokens.UserPort)
    private readonly userPort: UserPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: AccessTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        AuthConfig.accessToken,
      );
    } catch {
      throw new UnauthorizedException('Invalid Access Token');
    }

    const user = CoreAssert.notEmpty(
      await this.userPort.get({ id: payload.sub }),
      new UnauthorizedException(),
    );

    request.user = {
      id: user.id,
      roles: user.roles,
      name: user.name,
      email: user.email,
    };

    return true;
  }

  private extractTokenFromHeader(request: RequestWithUser): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
