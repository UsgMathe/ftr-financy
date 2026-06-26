import { Loader2Icon } from "lucide-react";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface LoadingContainerProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  loadingText?: string;
}

export function LoadingContainer({
  children,
  isLoading = false,
  className,
  loadingText = "Carregando...",
}: LoadingContainerProps) {
  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md">
            <Loader2Icon className="text-muted-foreground size-4 animate-spin" />
            <span className="text-muted-foreground text-sm">{loadingText}</span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
