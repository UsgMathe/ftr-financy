import { Category, User } from '@/generated/prisma/client';
import { prismaClient } from '@/prisma/prisma.client';
import { ConflictError } from '@/shared/errors/conflict.error';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { CreateCategoryInput } from './dtos/create-category.dto';
import { UpdateCategoryInput } from './dtos/update-category.dto';

export class CategoryService {
  async createCategory(userId: User['id'], data: CreateCategoryInput) {
    await this.validateCategoryExistsByTitle(userId, data.title);

    return prismaClient.category.create({
      data: {
        title: data.title,
        description: data.description,
        color: data.color,
        icon: data.icon,
        userId,
      },
      include: { user: true },
    });
  }

  async findCategory(userId: User['id'], id: Category['id']) {
    return this.validateCategoryExists(userId, id);
  }

  async listCategories(userId: User['id']) {
    const categories = await prismaClient.category.findMany({
      where: { userId },
      include: { user: true, _count: { select: { transactions: true } } },
    });

    return categories.map(cat => ({
      ...cat,
      transactionsCount: cat._count.transactions,
    }));
  }

  async updateCategory(
    userId: User['id'],
    id: Category['id'],
    data: UpdateCategoryInput,
  ) {
    await this.validateCategoryExists(userId, id);

    if (data.title) {
      await this.validateCategoryExistsByTitle(userId, data.title);
    }

    return prismaClient.category.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        color: data.color,
        icon: data.icon,
      },
      include: { user: true },
    });
  }

  async deleteCategory(userId: User['id'], id: Category['id']) {
    await this.validateCategoryExists(userId, id);

    await prismaClient.category.delete({
      where: { id },
    });

    return true;
  }

  async validateCategoryExists(userId: User['id'], id: Category['id']) {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
      include: { user: true },
    });

    if (!category) throw new NotFoundError('Categoria não encontrada');

    return category;
  }

  async validateCategoryExistsByTitle(
    userId: User['id'],
    title: Category['title'],
  ) {
    const category = await prismaClient.category.findFirst({
      where: { title, userId },
    });

    if (category)
      throw new ConflictError('Esta categoria já foi criada por este usuário');
  }
}
