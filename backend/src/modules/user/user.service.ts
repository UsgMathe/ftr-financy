import { User } from '@/generated/prisma/browser';
import { prismaClient } from '@/prisma/prisma.client';
import { ConflictError } from '@/shared/errors/conflict.error';
import { UnauthorizedError } from '@/shared/errors/unauthorized.error';
import { hashPassword } from '@/shared/utils/hash.utils';
import { CreateUserInput } from './dtos/create-user.dto';
import { UpdateUserInput } from './dtos/update-user.dto';

export class UserService {
  async createUser(data: CreateUserInput) {
    await this.validateUserExistsByEmail(data.email);

    return prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password),
      },
    });
  }

  async findUser(id: string) {
    return this.validateUserExists(id);
  }

  async findByEmail(email: string) {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    return user;
  }

  async listUsers() {
    return prismaClient.user.findMany();
  }

  async updateUser(userId: User['id'], data: UpdateUserInput) {
    await this.validateUserExists(userId);

    if (data.email) {
      await this.validateUserExistsByEmail(data.email);
    }

    return prismaClient.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
      },
    });
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

  private async validateUserExistsByEmail(email: string) {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (user) throw new ConflictError('Este email já está em uso');
  }
}
