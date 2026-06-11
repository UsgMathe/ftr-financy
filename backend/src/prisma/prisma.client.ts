import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { configDotenv } from 'dotenv';

configDotenv({ quiet: true });

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const globalForPrisma = global as {
  prisma?: PrismaClient;
};

export const prismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaClient;
}
