import { PrismaClient, Recipe } from '@prisma/client';
import { UserFixture } from './UserFixture';

export const DEFAULT_PASSWORD = '1234';

export class RecipeFixture {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly userFixture: UserFixture,
  ) {}

  public async insertOne(payload: Partial<Recipe>) {
    let userId = payload.userId;

    if (!userId) {
      const user = await this.userFixture.insertOne();

      userId = user.id;
    }

    // TODO: use repository instead once recipe creation is implemented
    const recipe = await this.prismaClient.recipe.create({
      data: {
        ...payload,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return recipe;
  }

  public async insertMany(payloads: Partial<Recipe>[]) {
    const recipes = await Promise.all(
      payloads.map(async (payload) => {
        const recipe = await this.insertOne(payload);

        return recipe;
      }),
    );

    return recipes;
  }

  public static create(
    prismaClient: PrismaClient,
    userFixture: UserFixture,
  ): RecipeFixture {
    return new RecipeFixture(prismaClient, userFixture);
  }
}
