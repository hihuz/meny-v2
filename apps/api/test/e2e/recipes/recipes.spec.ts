import * as supertest from 'supertest';
import { TestServer } from '@test/utils/TestServer';
import { prisma } from '@test/utils/prismaClient';
import { UserFixture } from '../fixtures/UserFixture';
import { RecipeFixture } from '../fixtures/RecipeFixture';
import { clearDb } from '@test/utils/clearDb';
import { RecipeDto } from '@core/domain/dto/recipe/RecipeDto';
import { Recipe } from '@core/domain/entities/Recipe';
import { instanceToPlain } from 'class-transformer';
import { orderItems } from '@test/utils/orderItems';
import { AuthFixture } from '../fixtures/AuthFixture';
import { User } from '@core/domain/entities/User';
import { ISO_DATE_REGEXP } from '@test/constants/isoDateRegexp';

describe('Recipes', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let recipeFixture: RecipeFixture;
  let authFixture: AuthFixture;

  const insertUser = async (payload: Partial<User> = {}) =>
    userFixture.insertOne({
      name: 'John',
      email: 'john@smith.com',
      password: 'temporary',
      roles: ['AUTHOR'],
      ...payload,
    });

  const insertUserAndLogin = async (payload: Partial<User> = {}) => {
    const user = await insertUser(payload);

    const tokens = await authFixture.login(
      user.email,
      payload.password || 'temporary',
    );

    return { user, tokens };
  };

  beforeAll(async () => {
    testServer = await TestServer.create();

    userFixture = UserFixture.create(testServer.testingModule);
    recipeFixture = RecipeFixture.create(prisma, userFixture);
    authFixture = AuthFixture.create(testServer.testingModule);

    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  describe('GET /recipes/:id', () => {
    let recipe: Recipe;

    beforeAll(async () => {
      await clearDb();

      recipe = await recipeFixture.insertOne({
        name: 'Some recipe',
        description: 'Yummy',
      });
    });

    it('should return properly formatted recipe', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .get(`/recipes/${recipe.id}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.email).toBeUndefined();
          expect(response.body.password).toBeUndefined();
          expect(response.body.roles).toBeUndefined();

          expect(response.body).toEqual(
            instanceToPlain(RecipeDto.createFromRecipe(recipe)),
          );
        });
    });

    it('should return a 404 error if recipe does not exist', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .get(`/recipes/9999`)
        .expect(404);
    });

    it('should return a 400 error if id is invalid', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .get(`/recipes/abcd`)
        .expect(400);
    });
  });

  describe('GET /recipes', () => {
    let recipes: Recipe[];

    beforeEach(async () => {
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

  describe('POST /recipes', () => {
    beforeEach(async () => {
      await clearDb();
    });

    it('should return a 401 error if bearer token is missing', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .post('/recipes')
        .send({
          name: 'Cool recipe',
        })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return a 401 error if bearer token is invalid', async () => {
      const user = await insertUser();
      const invalidToken = authFixture.generateAccessToken(
        {
          sub: user.id,
          roles: ['ADMIN'],
        },
        'invalid-secret',
      );

      await supertest(testServer.serverApplication.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({
          name: 'Cool recipe',
        })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Invalid Access Token',
          error: 'Unauthorized',
        });
    });

    it('should return a 400 error if request body is invalid', async () => {
      const { tokens } = await insertUserAndLogin();

      await supertest(testServer.serverApplication.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send({
          name: 'Cool recipe',
          invalid: 'property',
          cooking: 'abc',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'property invalid should not exist',
            'cooking must be an integer number',
          ],
          error: 'Bad Request',
        });
    });

    it('should create a minimal recipe', async () => {
      const minimalRecipeCommonFields = {
        id: 1,
        cooking: null,
        description: null,
        ingredients: [],
        name: null,
        note: null,
        preparation: null,
        price: null,
        season: 'UNSPECIFIED',
        servings: null,
        steps: [],
        type: 'UNSPECIFIED',
        visible: false,
      };

      const { tokens, user } = await insertUserAndLogin();

      await supertest(testServer.serverApplication.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send({})
        .expect(201)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            ...minimalRecipeCommonFields,
            createdAt: expect.stringMatching(ISO_DATE_REGEXP),
            updatedAt: expect.stringMatching(ISO_DATE_REGEXP),
            author: { id: 1, name: 'John' },
          });
        });

      const recipes = await prisma.recipe.findMany();

      expect(recipes.length).toEqual(1);
      expect(recipes[0]).toMatchObject({
        ...minimalRecipeCommonFields,
        userId: user.id,
      });
    });

    it('should create a complete recipe', async () => {
      const completeRecipeCommonFields = {
        cooking: 30,
        description: 'Cool recipe',
        ingredients: ['Salt', 'Flour', 'Water'],
        name: 'Pie',
        note: 'You can also add other stuff',
        preparation: 20,
        price: 1000,
        season: 'WINTER',
        servings: 4,
        steps: ['Cut the vegetables', '???', 'Profit'],
        type: 'MAIN',
        visible: true,
      };

      const { tokens, user } = await insertUserAndLogin();

      await supertest(testServer.serverApplication.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send({
          cooking: 30,
          description: 'Cool recipe',
          ingredients: ['Salt', 'Flour', 'Water'],
          name: 'Pie',
          note: 'You can also add other stuff',
          preparation: 20,
          price: 1000,
          season: 'WINTER',
          servings: 4,
          steps: ['Cut the vegetables', '???', 'Profit'],
          type: 'MAIN',
          visible: true,
        })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            ...completeRecipeCommonFields,
            id: 1,
            createdAt: expect.stringMatching(ISO_DATE_REGEXP),
            updatedAt: expect.stringMatching(ISO_DATE_REGEXP),
            author: { id: 1, name: 'John' },
          });
        });

      const recipes = await prisma.recipe.findMany();

      expect(recipes.length).toEqual(1);
      expect(recipes[0]).toMatchObject({
        ...completeRecipeCommonFields,
        id: 1,
        userId: user.id,
      });
    });

    it('should return a 401 error if user does not have appropriate roles', async () => {
      const { tokens } = await insertUserAndLogin({ roles: ['VIEWER'] });

      await supertest(testServer.serverApplication.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send({})
        .expect(401)
        .expect({
          statusCode: 401,
          message:
            'User does not have the necessary role to perform this request.',
          error: 'Unauthorized',
        });
    });

    it('should allow admins to create recipes', async () => {
      const { tokens } = await insertUserAndLogin({ roles: ['ADMIN'] });

      await supertest(testServer.serverApplication.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send({})
        .expect(201);
    });
  });

  describe('PATCH /recipes/:id', () => {
    beforeEach(async () => {
      await clearDb();
    });

    it('should return a 401 error if bearer token is missing', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .patch('/recipes/1')
        .send({
          name: 'Cool recipe',
        })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return a 401 error if bearer token is invalid', async () => {
      const user = await insertUser();
      const invalidToken = authFixture.generateAccessToken(
        {
          sub: user.id,
          roles: ['ADMIN'],
        },
        'invalid-secret',
      );

      await supertest(testServer.serverApplication.getHttpServer())
        .patch('/recipes/1')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({
          name: 'Cool recipe',
        })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Invalid Access Token',
          error: 'Unauthorized',
        });
    });

    it('should return a 400 error if request body is invalid', async () => {
      const { tokens, user } = await insertUserAndLogin();

      const recipe = await recipeFixture.insertOne({
        userId: user.id,
      });

      await supertest(testServer.serverApplication.getHttpServer())
        .patch(`/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send({
          name: 'Cool recipe',
          invalid: 'property',
          ingredients: 'abc',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'property invalid should not exist',
            'ingredients must be an array',
          ],
          error: 'Bad Request',
        });
    });

    it('should update an existing recipe', async () => {
      const { tokens, user } = await insertUserAndLogin();

      const recipe = await recipeFixture.insertOne({
        userId: user.id,
      });

      await supertest(testServer.serverApplication.getHttpServer())
        .patch(`/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send({
          name: 'Updated recipe name',
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            name: 'Updated recipe name',
          });
        });

      const recipes = await prisma.recipe.findMany();

      expect(recipes.length).toEqual(1);
      expect(recipes[0]).toMatchObject({
        name: 'Updated recipe name',
      });
    });

    it('should not allow a different author to update a recipe', async () => {
      const user = await insertUser();

      const recipe = await recipeFixture.insertOne({
        userId: user.id,
      });

      const { tokens } = await insertUserAndLogin({
        email: 'other@user.com',
      });

      await supertest(testServer.serverApplication.getHttpServer())
        .patch(`/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send({
          name: 'Updated recipe name',
        })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'User does not own this recipe.',
          error: 'Unauthorized',
        });

      const recipes = await prisma.recipe.findMany();

      expect(recipes.length).toEqual(1);
      expect(recipes[0]).toMatchObject({
        name: null,
      });
    });

    it('should allow admins to update any recipe', async () => {
      const user = await insertUser();

      const recipe = await recipeFixture.insertOne({
        userId: user.id,
      });

      const { tokens } = await insertUserAndLogin({
        email: 'other@user.com',
        roles: ['ADMIN'],
      });

      await supertest(testServer.serverApplication.getHttpServer())
        .patch(`/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send({
          name: 'Updated recipe name',
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            name: 'Updated recipe name',
          });
        });

      const recipes = await prisma.recipe.findMany();

      expect(recipes.length).toEqual(1);
      expect(recipes[0]).toMatchObject({
        name: 'Updated recipe name',
      });
    });
  });

  describe('DELETE /recipes/:id', () => {
    beforeEach(async () => {
      await clearDb();
    });

    it('should return a 401 error if bearer token is missing', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .delete('/recipes/1')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return a 401 error if bearer token is invalid', async () => {
      const user = await insertUser();
      const invalidToken = authFixture.generateAccessToken(
        {
          sub: user.id,
          roles: ['ADMIN'],
        },
        'invalid-secret',
      );

      await supertest(testServer.serverApplication.getHttpServer())
        .delete('/recipes/1')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Invalid Access Token',
          error: 'Unauthorized',
        });
    });

    it('should delete an existing recipe', async () => {
      const { tokens, user } = await insertUserAndLogin();

      const recipe = await recipeFixture.insertOne({
        userId: user.id,
      });

      await supertest(testServer.serverApplication.getHttpServer())
        .delete(`/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            id: recipe.id,
          });
        });

      const recipes = await prisma.recipe.findMany();

      expect(recipes.length).toEqual(0);
    });

    it('should not allow a different author to delete a recipe', async () => {
      const user = await insertUser();

      const recipe = await recipeFixture.insertOne({
        userId: user.id,
      });

      const { tokens } = await insertUserAndLogin({
        email: 'other@user.com',
      });

      await supertest(testServer.serverApplication.getHttpServer())
        .delete(`/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'User does not own this recipe.',
          error: 'Unauthorized',
        });

      const recipes = await prisma.recipe.findMany();

      expect(recipes.length).toEqual(1);
      expect(recipes[0]).toMatchObject({
        id: recipe.id,
      });
    });

    it('should allow admins to update any recipe', async () => {
      const user = await insertUser();

      const recipe = await recipeFixture.insertOne({
        userId: user.id,
      });

      const { tokens } = await insertUserAndLogin({
        email: 'other@user.com',
        roles: ['ADMIN'],
      });

      await supertest(testServer.serverApplication.getHttpServer())
        .delete(`/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            id: recipe.id,
          });
        });

      const recipes = await prisma.recipe.findMany();

      expect(recipes.length).toEqual(0);
    });
  });
});
