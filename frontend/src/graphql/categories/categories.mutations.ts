import type { CreateCategoryInput, UpdateCategoryInput } from "@/schemas/categories/categories.schema";
import { gql, type TypedDocumentNode } from "@apollo/client";
import type { CreateCategoryMutationData, UpdateCategoryMutationData } from "./categories.types";

export const CREATE_CATEGORY_MUTATION: TypedDocumentNode<CreateCategoryMutationData, CreateCategoryInput> = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      id
      title
      description
      color
      icon
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION: TypedDocumentNode<UpdateCategoryMutationData, UpdateCategoryInput> = gql`
  mutation UpdateCategory($categoryId: String!, $data: UpdateCategoryInput!) {
    updateCategory(id: $categoryId, data: $data) {
      id
      title
      description
      color
      icon
      createdAt
      updatedAt
    }
  }
`;
