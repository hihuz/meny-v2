import { RequestWithUser } from '@application/types/auth';
import { CoreAssert } from '@core/common/utils/assert/CoreAssert';
import { RecipeTokens } from '@core/domain/di/tokens/Recipe';
import { RecipePort } from '@core/domain/ports/Recipe';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RecipeOwnerGuard implements CanActivate {
  constructor(
    @Inject(RecipeTokens.RecipePort)
    private readonly recipePort: RecipePort,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const recipeId = Number(request.params.id);

    const recipe = CoreAssert.notEmpty(
      await this.recipePort.get({ id: recipeId }),
      new NotFoundException(),
    );

    const isAdmin = request.user.roles.includes('ADMIN');

    const isOwner = recipe.userId === request.user.id;

    if (isAdmin || isOwner) {
      return true;
    }

    throw new UnauthorizedException('User does not own this recipe.');
  }
}
