import { User } from '@/generated/prisma/client';
import { GqlUser } from '@/graphql/decorators/user.decorator';
import { IsAuth } from '@/shared/middlewares/is-auth.middleware';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { CreateTransactionInput } from './dtos/create-transaction.dto';
import { ListTransactionsFilterInput } from './dtos/list-transactions.dto';
import { UpdateTransactionInput } from './dtos/update-transaction.dto';
import { PaginatedTransactionsModel } from './models/paginated-transactions.model';
import { TransactionModel } from './models/transaction.model';
import { TransactionService } from './transaction.service';

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private readonly transactionService = new TransactionService();

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput)
    data: CreateTransactionInput,

    @GqlUser()
    user: User,
  ) {
    return this.transactionService.createTransaction(user.id, data);
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg('id', () => String)
    id: string,

    @Arg('data', () => UpdateTransactionInput)
    data: UpdateTransactionInput,

    @GqlUser()
    user: User,
  ) {
    return this.transactionService.updateTransaction(user.id, id, data);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg('id', () => String)
    id: string,

    @GqlUser()
    user: User,
  ) {
    return this.transactionService.deleteTransaction(user.id, id);
  }

  @Query(() => TransactionModel)
  async getTransaction(
    @Arg('id', () => String)
    id: string,

    @GqlUser()
    user: User,
  ) {
    return this.transactionService.findTransaction(user.id, id);
  }

  @Query(() => PaginatedTransactionsModel)
  async listTransactions(
    @GqlUser()
    user: User,

    @Arg('page', () => Int, { defaultValue: 1, nullable: true })
    page?: number,

    @Arg('limit', () => Int, { defaultValue: 10, nullable: true })
    limit?: number,

    @Arg('filters', () => ListTransactionsFilterInput, { nullable: true })
    filters?: ListTransactionsFilterInput,
  ) {
    return this.transactionService.listTransactions(
      user.id,
      page,
      limit,
      filters,
    );
  }
}
