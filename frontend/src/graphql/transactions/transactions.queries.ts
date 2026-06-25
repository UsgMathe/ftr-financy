import { gql, type TypedDocumentNode } from "@apollo/client";
import type { ListTransactionsQueryData } from "./transactions.types";

export const LIST_TRANSACTIONS_QUERY: TypedDocumentNode<ListTransactionsQueryData> = gql`
  query ListTransactions {
    listTransactions {
      id
      description
      date
      amount
      type
      category {
        id
        title
        description
        color
        icon
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
