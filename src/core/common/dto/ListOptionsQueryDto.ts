import { ListOptions } from '../persistence/ListOptions';
import { IsNumber, IsOptional } from 'class-validator';

export class ListOptionsQueryDto implements ListOptions {
  @IsOptional()
  @IsNumber()
  public take?: number;

  @IsOptional()
  @IsNumber()
  public skip?: number;
}
