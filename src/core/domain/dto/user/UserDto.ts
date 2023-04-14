import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Exclude } from 'class-transformer';
import { RecipeDto } from '../recipe/RecipeDto';
import { Role } from '@core/common/enums/Role';
import { User } from '@core/domain/entities/User';

export class UserDto {
  @ApiProperty()
  public id: number;

  @Exclude()
  public email: string;

  @Exclude()
  public password: string;

  @Exclude()
  public roles: `${Role}`[];

  @ApiProperty({
    description: 'The recipes authored by this user.',
    type: [RecipeDto],
  })
  public recipes?: RecipeDto[];

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updatedAt: string;

  public static createFromUser(user: User): UserDto {
    const dto = plainToInstance(UserDto, user);

    dto.createdAt = user.createdAt.toISOString();
    dto.updatedAt = user.updatedAt.toISOString();

    return dto;
  }

  public static createListFromUsers(users: User[]): UserDto[] {
    return users.map(this.createFromUser);
  }
}
