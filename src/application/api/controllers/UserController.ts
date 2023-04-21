import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UserTokens } from '@core/domain/di/tokens/User';
import { UserUseCases } from '@core/domain/usecases/User';
import { UserDto } from '@core/domain/dto/user/UserDto';
import { CreateUserDto } from '@core/domain/dto/user/CreateUserDto';

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

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  createUser(
    @Body(new ValidationPipe()) { email, password, name }: CreateUserDto,
  ) {
    return this.userUseCases.create({ email, password, name });
  }
}
