import * as supertest from 'supertest';
import { TestServer } from '@test/utils/TestServer';
import { UserFixture } from '../fixtures/UserFixture';
import { clearDb } from '@test/utils/clearDb';
import decode from 'jwt-decode';
import { User } from '@core/domain/entities/User';
import { prisma } from '@test/utils/prismaClient';
import { AuthFixture } from '../fixtures/AuthFixture';
import { RefreshTokenPayload } from '@core/domain/types/auth';

describe('Auth', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let authFixture: AuthFixture;

  beforeAll(async () => {
    testServer = await TestServer.create();

    userFixture = UserFixture.create(testServer.testingModule);
    authFixture = AuthFixture.create(testServer.testingModule);

    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  describe('POST /auth/login', () => {
    let user: User;

    beforeAll(async () => {
      await clearDb();

      user = await userFixture.insertOne({
        name: 'John',
        email: 'john@smith.com',
        password: 'temporary',
        roles: ['ADMIN'],
      });
    });

    it.each(['email', 'password'] as const)(
      'should return a 400 error if %p is missing from payload',
      async (input) => {
        const payload = {
          email: 'john@smith.com',
          password: 'temporary',
        };

        delete payload[input];

        await supertest(testServer.serverApplication.getHttpServer())
          .post(`/auth/login`)
          .set('Content-Type', 'application/json')
          .send(payload)
          .expect(400);
      },
    );

    it.each(['email', 'password'] as const)(
      'should return a generic 401 error if provided %p is invalid',
      async (input) => {
        const payload = {
          email: 'john@smith.com',
          password: 'temporary',
        };

        payload[input] = 'invalid@email.com';

        await supertest(testServer.serverApplication.getHttpServer())
          .post(`/auth/login`)
          .set('Content-Type', 'application/json')
          .send(payload)
          .expect(401, {
            statusCode: 401,
            message: 'Invalid email or password',
            error: 'Unauthorized',
          });
      },
    );

    it('should return an access and a refresh token when login is successful', async () => {
      const payload = {
        email: 'john@smith.com',
        password: 'temporary',
      };

      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/auth/login`)
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            access_token: expect.stringMatching(/^ey.+/),
            refresh_token: expect.stringMatching(/^ey.+/),
            token_type: 'Bearer',
          });

          const decodedAccessToken = decode(body.access_token);
          const decodedRefreshToken = decode(body.refresh_token);

          expect(decodedAccessToken).toEqual({
            sub: user.id,
            roles: ['ADMIN'],
            exp: expect.any(Number),
            iat: expect.any(Number),
          });

          expect(decodedRefreshToken).toEqual({
            sub: user.id,
            jti: expect.any(String),
            family: expect.any(String),
            exp: expect.any(Number),
            iat: expect.any(Number),
          });
        });

      const refreshTokens = await prisma.refreshToken.findMany({
        where: { userId: user.id },
      });

      expect(refreshTokens.length).toEqual(1);

      expect(refreshTokens[0]).toMatchObject({
        userId: user.id,
        jti: expect.any(String),
        family: expect.any(String),
      });
    });
  });

  describe('POST /auth/refresh', () => {
    let user: User;

    beforeEach(async () => {
      await clearDb();

      user = await userFixture.insertOne({
        name: 'John',
        email: 'john@smith.com',
        password: 'temporary',
        roles: ['ADMIN'],
      });
    });

    it('should return a 400 error if refresh token is missing from payload', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/auth/refresh`)
        .set('Content-Type', 'application/json')
        .send({})
        .expect(400);
    });

    it('should return a 400 error if provided refresh token is malformed', async () => {
      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/auth/refresh`)
        .set('Content-Type', 'application/json')
        .send({ refreshToken: 'malformed-token' })
        .expect(400);
    });

    it('should return a 401 error if provided refresh token signature is incorrect', async () => {
      const invalidToken = authFixture.generateRefreshToken(
        {
          jti: '1234',
          family: '4321',
          sub: user.id,
        },
        'invalid-secret',
      );

      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/auth/refresh`)
        .set('Content-Type', 'application/json')
        .send({ refreshToken: invalidToken })
        .expect(401);
    });

    it('should return a 401 error if refresh token reuse is detected', async () => {
      // Login with valid credentials
      const { refresh_token: initialRefreshToken } = await authFixture.login(
        user.email,
        'temporary',
      );

      // Use refresh token once to get a new accessToken / refreshToken pair
      const { body } = await supertest(
        testServer.serverApplication.getHttpServer(),
      )
        .post(`/auth/refresh`)
        .set('Content-Type', 'application/json')
        .send({ refreshToken: initialRefreshToken })
        .expect(200);

      const { refresh_token: secondRefreshToken } = body;

      // Attempt to use the same refresh token again: access should be denied
      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/auth/refresh`)
        .set('Content-Type', 'application/json')
        .send({ refreshToken: initialRefreshToken })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Invalid Refresh Token',
          error: 'Unauthorized',
        });

      // All tokens from the compromised family should be invalidated, including
      // the second refresh token obtained by exchanging the first valid refreshToken
      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/auth/refresh`)
        .set('Content-Type', 'application/json')
        .send({ refreshToken: secondRefreshToken })
        .expect({
          statusCode: 401,
          message: 'Invalid Refresh Token',
          error: 'Unauthorized',
        });

      const refreshTokens = await prisma.refreshToken.findMany();

      expect(refreshTokens.length).toEqual(0);
    });

    it('should preserve uncompromised families if refresh token reuse is detected', async () => {
      // Login with valid credentials for one session
      const { refresh_token: firstSessionRefreshToken } =
        await authFixture.login(user.email, 'temporary');

      // Login with valid credentials for another session
      const { refresh_token: secondSessionRefreshToken } =
        await authFixture.login(user.email, 'temporary');

      const decodedRefreshToken = decode<RefreshTokenPayload>(
        secondSessionRefreshToken,
      );

      // Use first session refresh token to get a new accessToken / refreshToken pair
      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/auth/refresh`)
        .set('Content-Type', 'application/json')
        .send({ refreshToken: firstSessionRefreshToken })
        .expect(200);

      // Attempt to use the same refresh token again: access should be denied
      await supertest(testServer.serverApplication.getHttpServer())
        .post(`/auth/refresh`)
        .set('Content-Type', 'application/json')
        .send({ refreshToken: firstSessionRefreshToken })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Invalid Refresh Token',
          error: 'Unauthorized',
        });

      const refreshTokens = await prisma.refreshToken.findMany();

      expect(refreshTokens.length).toEqual(1);
      expect(refreshTokens[0].family).toEqual(decodedRefreshToken.family);
    });
  });
});
