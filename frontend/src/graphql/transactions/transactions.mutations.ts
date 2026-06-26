import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  CreateTransactionMutationData,
  CreateTransactionMutationVariables,
  DeleteTransactionMutationData,
  DeleteTransactionMutationVariables,
  UpdateTransactionMutationData,
  UpdateTransactionMutationVariables,
} from "./transactions.types";

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

export const UPDATE_TRANSACTION_MUTATION: TypedDocumentNode<
  UpdateTransactionMutationData,
  UpdateTransactionMutationVariables
> = gql`
  mutation UpdateTransaction($transactionId: String!, $data: UpdateTransactionInput!) {
    updateTransaction(data: $data, id: $transactionId) {
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

export const DELETE_TRANSACTION_MUTATION: TypedDocumentNode<
  DeleteTransactionMutationData,
  DeleteTransactionMutationVariables
> = gql`
  mutation DeleteTransaction($transactionId: String!) {
    deleteTransaction(id: $transactionId)
  }
`;
