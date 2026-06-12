import bcrypt from 'bcryptjs';

import { prismaClient } from './prisma.client';
import { env } from '../shared/utils/env.utils';
import { UserRole } from '@/graphql/enums/user-role.enum';

async function main() {
  const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  const admin = await prismaClient.user.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: {},
    create: {
      email: env.ADMIN_EMAIL,
      name: env.ADMIN_NAME,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('Seed executado com sucesso: Usuário ADMIN criado ou já existe.');
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
