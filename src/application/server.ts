import { RootModule } from './modules/RootModule';
import { Logger } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiConfig } from '@infrastructure/config/Api';

const DEFAULT_API_NAME = 'Meny API';
const DEFAULT_DESCRIPTION = 'Documentation for the Meny API.';

export class Server {
  private readonly port: number = ApiConfig.PORT;
  private readonly title: string = ApiConfig.API_NAME || DEFAULT_API_NAME;
  private readonly description: string =
    ApiConfig.API_DESCRIPTION || DEFAULT_DESCRIPTION;
  private readonly version: string = ApiConfig.API_VERSION;

  public async run(): Promise<void> {
    const app: NestExpressApplication =
      await NestFactory.create<NestExpressApplication>(RootModule);

    this.buildSwaggerDocumentation(app);
    this.log();

    await app.listen(this.port);
  }

  private buildSwaggerDocumentation(app: NestExpressApplication) {
    const options = new DocumentBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setVersion(this.version)
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('documentation', app, document);
  }

  private log(): void {
    Logger.log(`Ready, listening on port ${this.port};`, Server.name);
  }
}
