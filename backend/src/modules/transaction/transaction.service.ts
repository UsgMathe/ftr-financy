import { Transaction, TransactionType } from '@/generated/prisma/client';
import { TransactionWhereInput } from '@/generated/prisma/models';
import { prismaClient } from '@/prisma/prisma.client';
import { BadRequestError } from '@/shared/errors/bad-request.error';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { buildPaginationMeta } from '@/shared/graphql/create-paginated-model.factory';
import { OrderDirection } from '@/shared/graphql/order-direction.enum';
import { User } from '@prisma/client';
import { CategoryService } from '../category/category.service';
import { CreateTransactionInput } from './dtos/create-transaction.dto';
import { ListTransactionsFilterInput } from './dtos/list-transactions.dto';
import { UpdateTransactionInput } from './dtos/update-transaction.dto';

export class TransactionService {
  private readonly categoryService = new CategoryService();

  async createTransaction(
    userId: User['id'],
    data: CreateTransactionInput,
  ): Promise<Transaction> {
    const category = await this.categoryService.validateCategoryExists(
      userId,
      data.categoryId,
      false,
    );

    if (!category) throw new BadRequestError('Categoria não encontrada');

    return prismaClient.transaction.create({
      data: {
        userId: userId,
        amount: data.amount,
        date: data.date,
        description: data.description,
        type: data.type,
        categoryId: data.categoryId,
      },
      include: { category: true, user: true },
    });
  }

  async findTransaction(userId: User['id'], id: Transaction['id']) {
    return this.validateTransactionExists(userId, id);
  }

  async listTransactions(
    userId: User['id'],
    page?: number,
    limit?: number,
    filters?: ListTransactionsFilterInput,
  ) {
    const safePage = page ?? 1;
    const skip = limit !== undefined ? (safePage - 1) * limit : undefined;

    const where: TransactionWhereInput = {
      userId,
    };

    if (filters?.search) {
      where.description = {
        contains: filters.search,
      };
    }

    if (filters?.type) where.type = filters.type;
    if (filters?.categoryId) where.categoryId = filters.categoryId;

    if (filters?.startDate || filters?.endDate) {
      where.date = {};

      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }

    const orderBy = filters?.orderBy
      ? { [filters.orderBy.field]: filters.orderBy.direction }
      : { date: OrderDirection.DESC };

    const [items, totalItems, totalIncome, totalExpense] =
      await prismaClient.$transaction([
        prismaClient.transaction.findMany({
          where,
          include: {
            category: true,
            user: true,
          },
          skip,
          take: limit,
          orderBy,
        }),

        prismaClient.transaction.count({ where }),

        prismaClient.transaction.aggregate({
          where: {
            ...where,
            type: TransactionType.INCOME,
          },
          _sum: {
            amount: true,
          },
        }),

        prismaClient.transaction.aggregate({
          where: {
            ...where,
            type: TransactionType.EXPENSE,
          },
          _sum: {
            amount: true,
          },
        }),
      ]);

    console.log({ where, totalIncome });

    const totalIncomeAmount = Number(totalIncome._sum.amount ?? 0);
    const totalExpenseAmount = Number(totalExpense._sum.amount ?? 0);

    const totalBalance = totalIncomeAmount - totalExpenseAmount;

    return {
      items,
      pagination:
        limit !== undefined
          ? buildPaginationMeta(totalItems, {
              page: safePage,
              limit,
            })
          : undefined,
      totalIncomeAmount,
      totalExpenseAmount,
      totalBalance,
    };
  }

  async updateTransaction(
    userId: User['id'],
    id: Transaction['id'],
    data: UpdateTransactionInput,
  ) {
    await this.validateTransactionExists(userId, id);
    if (data.categoryId) {
      const foundCategory = await this.categoryService.validateCategoryExists(
        userId,
        data.categoryId,
        false,
      );

      if (!foundCategory) throw new BadRequestError('Categoria não encontrada');
    }

    return prismaClient.transaction.update({
      where: { id },
      data: {
        amount: data.amount,
        date: data.date,
        description: data.description,
        type: data.type,
        categoryId: data.categoryId,
      },
      include: { category: true, user: true },
    });
  }

  async deleteTransaction(userId: User['id'], id: Transaction['id']) {
    await this.validateTransactionExists(userId, id);

    await prismaClient.transaction.delete({
      where: { id },
    });

    return true;
  }

  private async validateTransactionExists(
    userId: User['id'],
    id: Transaction['id'],
  ) {
    const transaction = await prismaClient.transaction.findFirst({
      where: { id, userId },
      include: { category: true, user: true },
    });

    if (!transaction) throw new NotFoundError('Transação não encontrada');

    return transaction;
  }
}
