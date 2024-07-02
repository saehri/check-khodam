import {PrismaClient} from '@prisma/client';

const prismaClientSingleton = () => new PrismaClient();

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = new PrismaClient();

if (process.env.NODE_ENV === 'production') globalThis.prisma = prisma;
