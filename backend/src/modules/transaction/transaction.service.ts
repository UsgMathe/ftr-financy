import { Transaction } from '@/generated/prisma/client';
import { prismaClient } from '@/prisma/prisma.client';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { User } from '@prisma/client';
import { CategoryService } from '../category/category.service';
import { CreateTransactionInput } from './dtos/create-transaction.dto';
import { UpdateTransactionInput } from './dtos/update-transaction.dto';

export class TransactionService {
  private readonly categoryService = new CategoryService();

  async createTransaction(
    userId: User['id'],
    data: CreateTransactionInput,
  ): Promise<Transaction> {
    await this.categoryService.validateCategoryExists(userId, data.categoryId);

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

  async listTransactions(userId: User['id']) {
    return prismaClient.transaction.findMany({
      where: { userId },
      include: { category: true, user: true },
    });
  }

  async updateTransaction(
    userId: User['id'],
    id: Transaction['id'],
    data: UpdateTransactionInput,
  ) {
    await this.validateTransactionExists(userId, id);

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
