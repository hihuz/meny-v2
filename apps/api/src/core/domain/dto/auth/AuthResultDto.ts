import { ApiProperty } from '@nestjs/swagger';

export class AuthResultDto {
  @ApiProperty({ type: 'string' })
  public access_token: string;

  @ApiProperty({ type: 'string' })
  public refresh_token: string;

  @ApiProperty({ type: 'string' })
  public token_type: string;
}
