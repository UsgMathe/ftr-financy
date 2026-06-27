import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  SiginoutMutationData,
  SigninMutationData,
  SigninMutationVariables,
  SignupMutationData,
  SignupMutationVariables,
} from "./auth.types";

export const SIGNUP_MUTATION: TypedDocumentNode<SignupMutationData, SignupMutationVariables> = gql`
  mutation Signup($data: SignupInput!) {
    signup(data: $data) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const SIGNIN_MUTATION: TypedDocumentNode<SigninMutationData, SigninMutationVariables> = gql`
  mutation Signin($data: SigninInput!) {
    signin(data: $data) {
      token
      refreshToken
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`;

export const SIGNOUT_MUTATION: TypedDocumentNode<SiginoutMutationData> = gql`
  mutation Signout {
    signout
  }
`;
