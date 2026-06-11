import { prismaClient } from '@/prisma/prisma.client';
import { UnauthorizedError } from '@/shared/errors/unauthorized.error';

export class UserService {
  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnauthorizedError('User not found');

    return user;
  }

  async listUsers() {
    return prismaClient.user.findMany();
  }
}
