import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
import { CategoriesPage } from "../categories/categories.page";
import { DashboardPage } from "../dashboard.page";
import { SigninPage } from "../signin.page";
import { SignupPage } from "../signup.page";
import { TransactionsPage } from "../transactions/transactions.page";
import { APP_ROUTES_PATHS } from "./app-routes-paths";
import { ProfilePage } from "../profile.page";

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
        <Route path={APP_ROUTES_PATHS.SIGNIN} element={<SigninPage />} />
        <Route path={APP_ROUTES_PATHS.SIGNUP} element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path={APP_ROUTES_PATHS.CATEGORIES} element={<CategoriesPage />} />
        <Route path={APP_ROUTES_PATHS.TRANSACTIONS} element={<TransactionsPage />} />
        <Route path={APP_ROUTES_PATHS.PROFILE} element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
