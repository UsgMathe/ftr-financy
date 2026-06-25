import { gql, type TypedDocumentNode } from "@apollo/client";
import type { PaginatedQueryVariables } from "../graphql.types";
import type { ListTransactionsQueryData } from "./transactions.types";

export const LIST_TRANSACTIONS_QUERY: TypedDocumentNode<ListTransactionsQueryData, PaginatedQueryVariables> = gql`
  query ListTransactions($limit: Int, $page: Int) {
    listTransactions(limit: $limit, page: $page) {
      items {
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
      pagination {
        page
        pageSize
        totalItems
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
