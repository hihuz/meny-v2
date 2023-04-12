import { RootModule } from '@application/modules/RootModule';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';

export class TestServer {
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly testingModule: TestingModule,
  ) {}

  public static async create(): Promise<TestServer> {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [RootModule],
    }).compile();

    const serverApplication: NestExpressApplication =
      testingModule.createNestApplication();

    return new TestServer(serverApplication, testingModule);
  }
}
