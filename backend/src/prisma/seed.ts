import { prismaClient } from './prisma.client';

async function main() {}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
