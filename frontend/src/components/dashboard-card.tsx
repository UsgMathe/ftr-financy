import type { IconName } from "@/types/icon.type";
import * as Icons from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

interface DashboardCardProps {
  title: ReactNode;
  description: ReactNode;
  icon: IconName;
  iconColor?: string;
}
export function DashboardCard({ title, description, icon, iconColor }: DashboardCardProps) {
  const Icon = Icons[icon] as Icons.LucideIcon;

  return (
    <Card>
      <CardContent className="flex gap-4">
        <div className="flex size-8 items-center justify-center pt-2">
          <Icon style={{ color: iconColor }} />
        </div>
        <div className="space-y-1">
          <p className="text-[28px] font-bold">{title}</p>
          <p className="text-muted-foreground text-xs font-medium">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
