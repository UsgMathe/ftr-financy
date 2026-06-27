import { gql, type TypedDocumentNode } from "@apollo/client";
import type { ListTransactionsQueryData, ListTransactionsQueryVariables } from "./transactions.types";

export const LIST_TRANSACTIONS_QUERY: TypedDocumentNode<ListTransactionsQueryData, ListTransactionsQueryVariables> =
  gql`
    query ListTransactions($limit: Int, $page: Int, $filters: ListTransactionsFilterInput) {
      listTransactions(limit: $limit, page: $page, filters: $filters) {
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
        totalIncomeAmount
        totalExpenseAmount
        totalBalance
      }
    }
  `;
