import { gql, type TypedDocumentNode } from "@apollo/client";
import type { PaginatedQueryVariables } from "../graphql.types";
import type { ListCategoriesQueryData } from "./categories.types";

export const LIST_CATEGORIES_QUERY: TypedDocumentNode<ListCategoriesQueryData, PaginatedQueryVariables> = gql`
  query ListCategories($limit: Int, $page: Int) {
    listCategories(limit: $limit, page: $page) {
      items {
        id
        title
        description
        color
        icon
        user {
          id
          name
          email
          createdAt
          updatedAt
        }
        transactionsCount
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
