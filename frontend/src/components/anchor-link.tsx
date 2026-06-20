import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function AnchorLink({ className, ...props }: ComponentProps<"a">) {
  return <a className={cn("text-brand-base font-medium underline-offset-4 hover:underline", className)} {...props} />;
}
