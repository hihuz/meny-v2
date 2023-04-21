import * as supertest from 'supertest';
import { TestServer } from '@test/utils/TestServer';
import { prismaClient } from '@test/utils/prismaClient';
import { UserFixture } from '../fixtures/UserFixture';
import { RecipeFixture } from '../fixtures/RecipeFixture';
import { clearDb } from '@test/utils/clearDb';
import { RecipeDto } from '@core/domain/dto/recipe/RecipeDto';
import { Recipe } from '@core/domain/entities/Recipe';
import { instanceToPlain } from 'class-transformer';
import { orderItems } from '@test/utils/orderItems';

describe('Recipes', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let recipeFixture: RecipeFixture;

  beforeAll(async () => {
    testServer = await TestServer.create();

    userFixture = UserFixture.create(prismaClient);
    recipeFixture = RecipeFixture.create(prismaClient, userFixture);

    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  describe('GET /recipes', () => {
    let recipes: Recipe[];

    beforeAll(async () => {
      await clearDb();

      recipes = await recipeFixture.insertMany([{}, {}]);
    });

    it('should return a list of recipes', async () => {
      const data = instanceToPlain<RecipeDto[]>(
        RecipeDto.createListFromRecipes(recipes),
      ) as RecipeDto[];

      await supertest(testServer.serverApplication.getHttpServer())
        .get('/recipes')
        .expect(200)
        .expect({
          data: orderItems(data),
          count: 2,
        });
    });
  });
});
