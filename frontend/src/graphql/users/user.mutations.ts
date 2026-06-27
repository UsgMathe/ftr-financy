import { gql, type TypedDocumentNode } from "@apollo/client";
import type { UpdateUserMutationData, UpdateUserMutationVariables } from "./users.types";

export const UPDATE_USER_MUTATION: TypedDocumentNode<UpdateUserMutationData, UpdateUserMutationVariables> = gql`
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;
