import { FindOptions } from '../persistence/options';
import { IsNumber, IsOptional } from 'class-validator';

export class ListOptionsQueryDto implements FindOptions {
  @IsOptional()
  @IsNumber()
  public take?: number;

  @IsOptional()
  @IsNumber()
  public skip?: number;
}
