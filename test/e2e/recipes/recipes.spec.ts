import * as supertest from 'supertest';
import { TestServer } from '@test/utils/TestServer';
import { prismaClient } from '@test/utils/prismaClient';
import { UserFixture } from '../fixtures/UserFixture';
import { RecipeFixture } from '../fixtures/RecipeFixture';
import { clearDb } from '@test/utils/clearDb';
import { RecipeDto } from '@core/domain/dto/recipe/RecipeDto';
import { Recipe } from '@core/domain/entities/recipe';
import { instanceToPlain } from 'class-transformer';

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

    it('should return a list of recipes', () => {
      return supertest(testServer.serverApplication.getHttpServer())
        .get('/recipes')
        .expect(200)
        .expect({
          data: instanceToPlain(RecipeDto.createListFromRecipes(recipes)),
          count: 2,
        });
    });
  });
});
