import { gql, type TypedDocumentNode } from "@apollo/client";
import type { CreateTransactionMutationData, CreateTransactionMutationVariables } from "./transactions.types";

export const CREATE_TRANSACTION_MUTATION: TypedDocumentNode<
  CreateTransactionMutationData,
  CreateTransactionMutationVariables
> = gql`
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
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
