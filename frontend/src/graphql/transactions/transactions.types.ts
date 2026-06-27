import type { CreateTransactionInput, UpdateTransactionInput } from "@/schemas/transactions/transactions.schema";
import type { OrderDirectionEnum, PaginatedQueryData, PaginatedQueryVariables } from "../graphql.types";
import type { TransactionModel, TransactionTypeEnum } from "./transaction.model";

export enum TransactionOrderFieldEnum {
  DATE = "DATE",
  AMOUNT = "AMOUNT",
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
}

export interface TransactionOrderByVariables {
  field?: TransactionOrderFieldEnum;
  direction?: OrderDirectionEnum;
}

export interface ListTransactionFilters {
  search?: string;
  type?: TransactionTypeEnum;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: TransactionOrderByVariables;
}

export interface ListTransactionsQueryData {
  listTransactions: PaginatedQueryData<TransactionModel> & {
    totalIncomeAmount: number;
    totalExpenseAmount: number;
    totalBalance: number;
  };
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
