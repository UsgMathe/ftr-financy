import type { PaginatedQueryData } from "../graphql.types";
import type { TransactionModel } from "./transaction.model";

export interface ListTransactionsQueryData {
  listTransactions: PaginatedQueryData<TransactionModel>;
}
