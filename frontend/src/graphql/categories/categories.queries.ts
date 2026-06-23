import { gql, type TypedDocumentNode } from "@apollo/client";
import type { ListCategoriesQueryData } from "./categories.types";

export const LIST_CATEGORIES_QUERY: TypedDocumentNode<ListCategoriesQueryData> = gql`
  query ListCategories {
    listCategories {
      id
      title
      description
      color
      icon
      createdAt
      updatedAt
      transactionsCount
    }
  }
`;
