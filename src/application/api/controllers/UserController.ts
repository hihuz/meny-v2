import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UserTokens } from '@core/domain/di/tokens/User';
import { UserUseCases } from '@core/domain/usecases/User';
import { UserDto } from '@core/domain/dto/user/UserDto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserTokens.UserUseCase)
    private readonly userUseCases: UserUseCases,
  ) {}

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  getUser(@Param('id', new ParseIntPipe()) id: number): Promise<UserDto> {
    return this.userUseCases.get(id);
  }
}
