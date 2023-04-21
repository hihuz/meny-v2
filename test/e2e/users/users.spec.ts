import * as supertest from 'supertest';
import { TestServer } from '@test/utils/TestServer';
import { prismaClient } from '@test/utils/prismaClient';
import { UserFixture } from '../fixtures/UserFixture';
import { clearDb } from '@test/utils/clearDb';
import { instanceToPlain } from 'class-transformer';
import { User } from '@core/domain/entities/User';
import { UserDto } from '@core/domain/dto/user/UserDto';

describe('Users', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;

  beforeAll(async () => {
    testServer = await TestServer.create();

    userFixture = UserFixture.create(testServer.testingModule);

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

    it('should return only exposed user fields', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
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

    it('should return a 404 error if user does not exist', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .get(`/users/9999`)
        .expect(404);
    });

    it('should return a 400 error if id is invalid', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .get(`/users/abcd`)
        .expect(400);
    });
  });

  describe('POST /users', () => {
    beforeEach(async () => {
      await clearDb();
    });

    it('should return a 409 error if email is already in use', async () => {
      await userFixture.insertOne({
        name: 'John',
        email: 'john@smith.com',
        password: '1234',
        roles: ['AUTHOR'],
      });

      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/users`)
        .set('Content-Type', 'application/json')
        .send({
          email: 'JoHn@SmItH.CoM',
          password: 'temporary',
        })
        .expect(409);
    });

    it.each(['email', 'password'] as const)(
      'should return a 400 error if %p is missing from payload',
      async (input) => {
        const payload = {
          email: 'jean.dupont@email.com',
          password: 'temporary',
        };

        delete payload[input];

        await supertest(testServer.serverApplication.getHttpServer())
          .post(`/users`)
          .set('Content-Type', 'application/json')
          .send(payload)
          .expect(400);
      },
    );

    it('should properly create a new user', async () => {
      const email = 'jean.dupont@email.com';
      const name = 'super-dupont';

      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/users`)
        .set('Content-Type', 'application/json')
        .send({
          email,
          password: 'temporary',
          name,
        })
        .expect((response) => {
          expect(response.body.password).toBeUndefined();

          expect(response.body).toMatchObject({
            name,
            email,
          });
        });

      const user = await prismaClient.user.findFirst({ where: { email } });

      expect(user).toMatchObject({ email, name, roles: ['AUTHOR'] });
    });

    it('should use email as default name for user', async () => {
      const email = 'jean.dupont@email.com';

      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/users`)
        .set('Content-Type', 'application/json')
        .send({
          email,
          password: 'temporary',
        })
        .expect((response) => {
          expect(response.body.password).toBeUndefined();

          expect(response.body).toMatchObject({
            name: email,
            email,
          });
        });

      const user = await prismaClient.user.findFirst({ where: { email } });

      expect(user).toMatchObject({ email, name: email, roles: ['AUTHOR'] });
    });
  });
});
