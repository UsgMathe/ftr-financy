import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { NavBar } from "./nav-bar";

interface LayoutProps extends ComponentProps<"div"> {}

export function Layout({ className, ...props }: LayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-gray-100">
      <NavBar />
      <div className={cn("flex flex-1 flex-col px-4 py-12 sm:px-12", className)} {...props} />
    </div>
  );
}
