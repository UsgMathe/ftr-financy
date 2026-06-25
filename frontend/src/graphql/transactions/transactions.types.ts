import type { CreateTransactionInput } from "@/schemas/transactions/transactions.schema";
import type { PaginatedQueryData } from "../graphql.types";
import type { TransactionModel } from "./transaction.model";

export interface ListTransactionsQueryData {
  listTransactions: PaginatedQueryData<TransactionModel>;
}

export interface CreateTransactionMutationData {
  createTransaction: TransactionModel;
}

export interface CreateTransactionMutationVariables {
  data: CreateTransactionInput;
}
