import { Category, User } from '@/generated/prisma/client';
import { prismaClient } from '@/prisma/prisma.client';
import { BadRequestError } from '@/shared/errors/bad-request.error';
import { ConflictError } from '@/shared/errors/conflict.error';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { buildPaginationMeta } from '@/shared/graphql/create-paginated-model.factory';
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

  async listCategories(
    userId: User['id'],
    page?: number,
    limit?: number,
  ) {
    const safePage = page ?? 1;
    const safeLimit = limit ?? 10;
    const skip = (safePage - 1) * safeLimit;

    const [categories, totalItems] = await prismaClient.$transaction([
      prismaClient.category.findMany({
        where: { userId },
        include: { user: true, _count: { select: { transactions: true } } },
        skip,
        take: safeLimit,
      }),
      prismaClient.category.count({
        where: { userId },
      }),
    ]);

    const items = categories.map(cat => ({
      ...cat,
      transactionsCount: cat._count.transactions,
    }));

    return {
      items,
      pagination: buildPaginationMeta(totalItems, { page: safePage, limit: safeLimit }),
    };
  }

  async updateCategory(
    userId: User['id'],
    id: Category['id'],
    data: UpdateCategoryInput,
  ) {
    const category = await this.validateCategoryExists(userId, id);

    if (data.title && data.title !== category.title) {
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

    const transactionsCount = await prismaClient.transaction.count({
      where: { categoryId: id },
    });

    if (transactionsCount > 1) {
      throw new BadRequestError(
        'Não é possível excluir uma categoria que possui transaçãoes vinculadas.',
      );
    }

    await prismaClient.category.delete({
      where: { id },
    });

    return true;
  }

  async validateCategoryExists(
    userId: User['id'],
    id: Category['id'],
    throwError: boolean = true,
  ) {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
      include: { user: true, _count: { select: { transactions: true } } },
    });

    if (!category) {
      if (throwError) throw new NotFoundError('Categoria não encontrada');
      return null;
    }

    return { ...category, transactionsCount: category._count.transactions };
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
