import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginInputDto {
  @ApiProperty({ type: 'string' })
  @IsEmail()
  public email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  public password: string;
}
