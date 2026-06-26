import { gql, type TypedDocumentNode } from "@apollo/client";
import type { ListCategoriesQueryData, ListCategoriesQueryVariables } from "./categories.types";

export const LIST_CATEGORIES_QUERY: TypedDocumentNode<ListCategoriesQueryData, ListCategoriesQueryVariables> = gql`
  query ListCategories($limit: Int, $page: Int, $filters: ListCategoriesFilterInput) {
    listCategories(limit: $limit, page: $page, filters: $filters) {
      items {
        id
        title
        description
        color
        icon
        transactionsCount
        totalAmount
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
