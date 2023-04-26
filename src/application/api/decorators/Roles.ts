import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '@core/common/enums/Role';
import { RoleGuard } from '../guards/RoleGuard';
import { AuthGuard } from '../guards/AuthGuard';

export const Roles = (...roles: Role[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard, RoleGuard));
