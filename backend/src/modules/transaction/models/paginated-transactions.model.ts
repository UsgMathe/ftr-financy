import { createPaginatedModel } from '@/shared/graphql/create-paginated-model.factory';
import { Field, Float, ObjectType } from 'type-graphql';
import { TransactionModel } from './transaction.model';

@ObjectType()
export class PaginatedTransactionsModel extends createPaginatedModel(
  TransactionModel,
) {
  @Field(() => Float)
  totalIncomeAmount!: number;

  @Field(() => Float)
  totalExpenseAmount!: number;

  @Field(() => Float)
  totalBalance!: number;
}
