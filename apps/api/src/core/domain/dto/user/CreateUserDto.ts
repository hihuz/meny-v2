import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: 'string' })
  @IsEmail()
  public email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(8)
  public password: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  public name?: string;
}
