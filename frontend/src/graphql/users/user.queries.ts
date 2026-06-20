import { gql, type TypedDocumentNode } from "@apollo/client";

import type { GetUserQueryData } from "./users.types";

export const GET_USER_QUERY: TypedDocumentNode<GetUserQueryData> = gql`
  query GetUser {
    getUser {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;
