import { prismaClient } from '@/prisma/prisma.client';
import { UnauthorizedError } from '@/shared/errors/unauthorized.error';
import { hashPassword } from '@/shared/utils/hash.utils';
import { CreateUserInput } from './dtos/create-user.dto';

export class UserService {
  async findUser(id: string) {
    return this.validateUserExists(id);
  }

  async findByEmail(email: string) {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    return user;
  }

  async createUser(data: CreateUserInput) {
    const foundUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (foundUser) throw new Error('Este email já está cadastrado');
    if (!data.password) throw new Error('Senha é obrigatória');

    return prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password),
      },
    });
  }
  async listUsers() {
    return prismaClient.user.findMany();
  }

  async deleteUser(id: string) {
    await this.validateUserExists(id);

    await prismaClient.user.delete({
      where: { id },
    });

    return true;
  }

  private async validateUserExists(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnauthorizedError('Usuário não encontrado');

    return user;
  }
}
