import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  CreateCategoryMutationData,
  CreateCategoryMutationVariables,
  UpdateCategoryMutationData,
  UpdateCategoryMutationVariables,
} from "./categories.types";

export const CREATE_CATEGORY_MUTATION: TypedDocumentNode<CreateCategoryMutationData, CreateCategoryMutationVariables> =
  gql`
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

export const UPDATE_CATEGORY_MUTATION: TypedDocumentNode<UpdateCategoryMutationData, UpdateCategoryMutationVariables> =
  gql`
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
