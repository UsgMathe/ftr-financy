import { ObjectType } from 'type-graphql';
import { createPaginatedModel } from '@/shared/graphql/create-paginated-model.factory';
import { TransactionModel } from './transaction.model';

@ObjectType()
export class PaginatedTransactionsModel extends createPaginatedModel(TransactionModel) {}
