import { useAuthStore } from "@/stores/auth.store";
import { env } from "@/utils/env";
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: env.VITE_BACKEND_URL,
  credentials: "include",
});

const errorLink = new ErrorLink(({ error }) => {
  if (!error || !("errors" in error)) return;

  if (Array.isArray(error.errors)) {
    const unauthorized = error.errors.some((err) => err.extensions?.statusCode === 401);

    if (unauthorized) {
      useAuthStore.getState().signout();
    }
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink, errorLink]),
  cache: new InMemoryCache(),
});
