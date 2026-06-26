import { cn } from "@/lib/utils";
import type { IconName } from "@/types/icon.type";
import * as Icons from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

interface DashboardCardProps {
  value: ReactNode;
  label: ReactNode;
  icon: IconName;
  iconColor?: string;
  variant?: "default" | "highlight";
}

export function DashboardCard({ value, label, icon, iconColor, variant = "default" }: DashboardCardProps) {
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
              <p className="text-[28px] font-bold">{value}</p>
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

            <p className="text-[28px] font-bold">{value}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
