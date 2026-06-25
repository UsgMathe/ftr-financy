import type { TransactionModel } from "./transaction.model";

export interface ListTransactionsQueryData {
  listTransactions: Array<TransactionModel>;
}
