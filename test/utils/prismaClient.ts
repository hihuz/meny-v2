import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

// eslint-disable-next-line prefer-const
prisma = global.prisma;

export { prisma };
