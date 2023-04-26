import { RequestWithUser } from '@application/types/auth';
import { Role } from '@core/common/enums/Role';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles =
      this.reflector.get<Role[]>('roles', context.getHandler()) || [];

    const request: RequestWithUser = context.switchToHttp().getRequest();

    const isAdmin = request.user.roles.includes('ADMIN');

    const hasRole = roles.find((role) => request.user.roles.includes(role));

    if (isAdmin || hasRole) {
      return true;
    }

    throw new UnauthorizedException(
      'User does not have the necessary role to perform this request.',
    );
  }
}
