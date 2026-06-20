import { apolloClient } from "@/api/apollo";
import { SIGNIN_MUTATION, SIGNUP_MUTATION } from "@/graphql/auth/auth.mutations";
import { GET_USER_QUERY } from "@/graphql/users/user.queries";
import type { SigninInput } from "@/schemas/auth/signin.schema";
import type { SignupInput } from "@/schemas/auth/signup.schema";

export const authService = {
  async signup(dto: SignupInput) {
    try {
      const { data } = await apolloClient.mutate({ mutation: SIGNUP_MUTATION, variables: { data: dto } });

      return data.signup;
    } catch (error) {
      handleError(error);
    }
  },

  async signin(dto: SigninInput) {
    try {
      const { data } = await apolloClient.mutate({ mutation: SIGNIN_MUTATION, variables: { data: dto } });

      return data.signin;
    } catch (error) {
      handleError(error);
    }
  },

  async checkAuth() {
    try {
      const { data } = await apolloClient.query({ query: GET_USER_QUERY });

      return data.getUser;
    } catch (error) {
      handleError(error);
    }
  },
};

function handleError(error: unknown) {
  if (error instanceof Error) {
    throw new Error(error.message);
  }

  throw error;
}
