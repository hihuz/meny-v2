import { GenericPort } from '@core/common/ports/GenericPort';
import { RefreshToken } from '../entities/RefreshToken';
import { ListOptions } from '@core/common/persistence/ListOptions';
import { DeleteManyOptions } from '@core/common/persistence/DeleteManyOptions';

export type GetRefreshTokenOptions = Pick<RefreshToken, 'jti'>;

export type CreateRefreshTokenOptions = Pick<
  RefreshToken,
  'userId' | 'jti' | 'family' | 'expiresAt'
>;

export interface RefreshTokenPort extends GenericPort<RefreshToken> {
  create(options: CreateRefreshTokenOptions): Promise<RefreshToken>;

  get(options: GetRefreshTokenOptions): Promise<RefreshToken | null>;

  getList(
    options: ListOptions<RefreshToken>,
  ): Promise<readonly [RefreshToken[], number]>;

  deleteMany(options?: DeleteManyOptions<RefreshToken>): Promise<number>;
}
