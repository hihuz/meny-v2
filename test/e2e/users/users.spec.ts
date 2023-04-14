import * as supertest from 'supertest';
import { TestServer } from '@test/utils/TestServer';
import { prismaClient } from '@test/utils/prismaClient';
import { UserFixture } from '../fixtures/UserFixture';
import { clearDb } from '@test/utils/clearDb';
import { instanceToPlain } from 'class-transformer';
import { User } from '@core/domain/entities/User';
import { UserDto } from '@core/domain/dto/user/UserDto';

describe('Recipes', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;

  beforeAll(async () => {
    testServer = await TestServer.create();

    userFixture = UserFixture.create(prismaClient);

    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  describe('GET /users/:id', () => {
    let user: User;

    beforeAll(async () => {
      await clearDb();

      user = await userFixture.insertOne({
        name: 'John',
        email: 'john@smith.com',
        password: '1234',
        roles: ['ADMIN'],
      });
    });

    it('should return only exposed user fields', () => {
      return supertest(testServer.serverApplication.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.email).toBeUndefined();
          expect(response.body.password).toBeUndefined();
          expect(response.body.roles).toBeUndefined();

          expect(response.body).toEqual(
            instanceToPlain(UserDto.createFromUser(user)),
          );
        });
    });

    it('should return a 404 error if user does not exist', () => {
      return supertest(testServer.serverApplication.getHttpServer())
        .get(`/users/9999`)
        .expect(404);
    });

    it('should return a 400 error if id is invalid', () => {
      return supertest(testServer.serverApplication.getHttpServer())
        .get(`/users/abcd`)
        .expect(400);
    });
  });
});
