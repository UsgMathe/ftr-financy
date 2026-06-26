import type { CreateTransactionInput, UpdateTransactionInput } from "@/schemas/transactions/transactions.schema";
import type { PaginatedQueryData, PaginatedQueryVariables } from "../graphql.types";
import type { TransactionModel, TransactionTypeEnum } from "./transaction.model";

export interface ListTransactionFilters {
  search?: string;
  type?: TransactionTypeEnum;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ListTransactionsQueryData {
  listTransactions: PaginatedQueryData<TransactionModel>;
}

export interface ListTransactionsQueryVariables extends PaginatedQueryVariables {
  filters?: ListTransactionFilters;
}

export interface CreateTransactionMutationData {
  createTransaction: TransactionModel;
}

export interface CreateTransactionMutationVariables {
  data: CreateTransactionInput;
}

export interface UpdateTransactionMutationData {
  updateTransaction: TransactionModel;
}

export interface UpdateTransactionMutationVariables {
  transactionId: TransactionModel["id"];
  data: UpdateTransactionInput;
}

export interface DeleteTransactionMutationData {
  deleteTransaction: boolean;
}

export interface DeleteTransactionMutationVariables {
  transactionId: TransactionModel["id"];
}
