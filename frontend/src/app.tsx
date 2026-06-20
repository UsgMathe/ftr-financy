import { useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Toaster } from "sonner";
import { Layout } from "./components/layout";
import { HomePage } from "./pages/home.page";
import { SigninPage } from "./pages/signin.page";
import { SignupPage } from "./pages/signup.page";
import { useAuthStore } from "./stores/auth.store";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

export function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Layout>
      <Toaster richColors />

      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SigninPage />
            </PublicRoute>
          }
        />

        <Route
          index
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
