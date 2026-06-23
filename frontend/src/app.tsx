import { useEffect } from "react";

import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "sonner";
import { apolloClient } from "./api/apollo";
import { Layout } from "./components/layout";
import { PageRoutes } from "./pages/routes/page.routes";
import { useAuthStore } from "./stores/auth.store";

export function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Toaster richColors />
        <PageRoutes />
      </Layout>
    </ApolloProvider>
  );
}
