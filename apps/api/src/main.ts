import 'module-alias/register';

import { Server } from '@application/server';

async function bootstrap() {
  const server = new Server();

  await server.run();
}

bootstrap();
