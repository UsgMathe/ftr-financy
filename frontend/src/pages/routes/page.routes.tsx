import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
import { HomePage } from "../home.page";
import { SigninPage } from "../signin.page";
import { SignupPage } from "../signup.page";
import { ROUTES_PATHS } from "./routes-paths";
import { CategoriesPage } from "../categories/categories.page";

function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}

function PublicLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export function PageRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES_PATHS.SIGNIN} element={<SigninPage />} />
        <Route path={ROUTES_PATHS.SIGNUP} element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Route>
    </Routes>
  );
}
