import { RootModule } from './modules/RootModule';
import { Logger } from '@nestjs/common';
import { ApiConfig } from '@infrastructure/config/Api';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

export class Server {
  private readonly host: string = ApiConfig.HOST;

  private readonly port: number = ApiConfig.PORT;

  public async run(): Promise<void> {
    const app: NestExpressApplication =
      await NestFactory.create<NestExpressApplication>(RootModule);

    this.log();

    await app.listen(this.port, this.host);
  }

  private log(): void {
    Logger.log(
      `Server started on host: ${this.host}; port: ${this.port};`,
      Server.name,
    );
  }
}
