import { prisma } from './prismaClient';

export const clearDb = async () => {
  await prisma.$transaction([
    prisma.recipe.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.user.deleteMany(),
    prisma.$queryRaw`ALTER SEQUENCE "Recipe_id_seq" RESTART WITH 1`,
    prisma.$queryRaw`ALTER SEQUENCE "RefreshToken_id_seq" RESTART WITH 1`,
    prisma.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`,
  ]);
};
