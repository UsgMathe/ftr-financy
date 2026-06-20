import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { NavBar } from "./nav-bar";

interface LayoutProps extends ComponentProps<"div"> {}

export function Layout({ className, ...props }: LayoutProps) {
  return (
    <div className="min-h-dvh bg-gray-100">
      <NavBar />
      <div className={cn("p-12", className)} {...props} />
    </div>
  );
}
