import { Role } from '@core/common/enums/Role';

export type RefreshTokenPayload = {
  sub: number;
  jti: string;
  family: string;
};

export type AccessTokenPayload = {
  sub: number;
  roles: `${Role}`[];
};
