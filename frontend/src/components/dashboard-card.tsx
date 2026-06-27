import { cn } from "@/lib/utils";
import type { IconName } from "@/types/icon.type";
import * as Icons from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface DashboardCardProps {
  value: ReactNode;
  label: ReactNode;
  icon: IconName;
  iconColor?: string;
  variant?: "default" | "highlight";
  isLoading?: boolean;
}

export function DashboardCard({ value, label, icon, iconColor, variant = "default", isLoading }: DashboardCardProps) {
  const Icon = Icons[icon] as Icons.LucideIcon;

  return (
    <Card>
      <CardContent className={cn("flex gap-4", variant === "highlight" && "flex-col")}>
        {variant === "default" ? (
          <>
            <div className="flex size-8 items-center justify-center pt-2">
              <Icon style={{ color: iconColor }} />
            </div>

            <div className="space-y-1">
              {isLoading ? <Skeleton className="h-8 w-full" /> : <p className="text-[28px] font-bold">{value}</p>}
              <p className="text-muted-foreground uppercaser text-xs font-medium tracking-wide">{label}</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex size-5 items-center justify-center">
                <Icon style={{ color: iconColor }} />
              </div>

              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">{label}</p>
            </div>

            {isLoading ? <Skeleton className="h-8 w-full" /> : <p className="text-[28px] font-bold">{value}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
