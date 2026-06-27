import { Logo } from "@/assets";
import { APP_ROUTES_PATHS } from "@/pages/routes/app-routes-paths";
import { useAuthStore } from "@/stores/auth.store";
import { getInitials } from "@/utils/get-initials";
import type { ReactNode } from "react";
import { Link, NavLink, type To } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function NavBar() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) return;

  return (
    <nav className="sticky top-0 z-1 flex items-center justify-between border-b border-gray-200 bg-white px-12 py-4">
      <NavLink to={APP_ROUTES_PATHS.DASHBOARD}>
        <Logo className="w-fit max-w-24" />
      </NavLink>

      <div className="flex items-center gap-5">
        <HeaderLink to={APP_ROUTES_PATHS.DASHBOARD}>Dashboard</HeaderLink>
        <HeaderLink to={APP_ROUTES_PATHS.TRANSACTIONS}>Transações</HeaderLink>
        <HeaderLink to={APP_ROUTES_PATHS.CATEGORIES}>Categorias</HeaderLink>
      </div>

      <Link to={APP_ROUTES_PATHS.PROFILE}>
        <Avatar size="lg">
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
      </Link>
    </nav>
  );
}
interface HeaderLinkProps {
  to: To;
  children: ReactNode;
}
function HeaderLink({ to, children }: HeaderLinkProps) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <p
          aria-selected={isActive}
          className="aria-selected:text-brand-base text-sm font-normal text-gray-600 transition-[color,font-weight] hover:font-medium aria-selected:font-semibold"
        >
          {children}
        </p>
      )}
    </NavLink>
  );
}
