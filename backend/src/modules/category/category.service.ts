import {
  Category,
  Prisma,
  TransactionType,
  User,
} from '@/generated/prisma/client';
import { CategoryWhereInput } from '@/generated/prisma/models';
import { prismaClient } from '@/prisma/prisma.client';
import { BadRequestError } from '@/shared/errors/bad-request.error';
import { ConflictError } from '@/shared/errors/conflict.error';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { buildPaginationMeta } from '@/shared/graphql/create-paginated-model.factory';
import { OrderDirection } from '@/shared/graphql/order-direction.enum';
import { CreateCategoryInput } from './dtos/create-category.dto';
import {
  CategoryOrderFieldEnum,
  ListCategoriesFilterInput,
} from './dtos/list-categories.dto';
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
    filters?: ListCategoriesFilterInput,
  ) {
    const safePage = page ?? 1;
    const skip = limit !== undefined ? (safePage - 1) * limit : undefined;

    const where: CategoryWhereInput = {
      userId,
    };

    if (filters?.search) {
      where.OR = [
        {
          title: {
            contains: filters.search,
          },
        },
        {
          description: {
            contains: filters.search,
          },
        },
      ];
    }

    const direction = filters?.orderBy?.direction ?? OrderDirection.DESC;

    const orderBy: Prisma.CategoryOrderByWithRelationInput = (() => {
      switch (filters?.orderBy?.field) {
        case CategoryOrderFieldEnum.TITLE:
          return { title: direction };

        case CategoryOrderFieldEnum.CREATED_AT:
          return { createdAt: direction };

        case CategoryOrderFieldEnum.UPDATED_AT:
          return { updatedAt: direction };

        case CategoryOrderFieldEnum.TRANSACTIONS_COUNT:
          return {
            transactions: {
              _count: direction,
            },
          };

        default:
          return { title: OrderDirection.ASC };
      }
    })();

    const [categories, totalItems] = await prismaClient.$transaction([
      prismaClient.category.findMany({
        where,
        include: {
          user: true,
          _count: {
            select: {
              transactions: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),

      prismaClient.category.count({
        where,
      }),
    ]);

    const categoryIds = categories.map(category => category.id);

    const groupedTransactions =
      categoryIds.length === 0
        ? []
        : await prismaClient.transaction.groupBy({
            by: ['categoryId', 'type'],
            where: {
              userId,
              categoryId: {
                in: categoryIds,
              },
            },
            _sum: {
              amount: true,
            },
          });

    const totalsMap = new Map<string, number>();

    for (const transaction of groupedTransactions) {
      const current = totalsMap.get(transaction.categoryId) ?? 0;
      const amount = Number(transaction._sum.amount ?? 0);

      totalsMap.set(
        transaction.categoryId,
        current +
          (transaction.type === TransactionType.INCOME ? amount : -amount),
      );
    }

    const items = categories.map(({ _count, ...category }) => ({
      ...category,
      transactionsCount: _count.transactions,
      totalAmount: totalsMap.get(category.id) ?? 0,
    }));

    return {
      items,
      pagination:
        limit !== undefined
          ? buildPaginationMeta(totalItems, {
              page: safePage,
              limit,
            })
          : undefined,
    };
  }

  async updateCategory(
    userId: User['id'],
    id: Category['id'],
    data: UpdateCategoryInput,
  ) {
    const category = await this.validateCategoryExists(userId, id);

    if (data.title && data.title !== category?.title) {
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

    if (transactionsCount > 0) {
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
