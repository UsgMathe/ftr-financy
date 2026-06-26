import { cn } from "@/lib/utils";
import type { IconName } from "@/types/icon.type";
import * as Icons from "lucide-react";

interface IconBlockProps {
  icon: IconName;
  color: string;
  className?: string;
}

export function IconBlock({ icon, color, className }: IconBlockProps) {
  const IconComponent = Icons[icon as IconName] as Icons.LucideIcon;

  const backgroundColor = `${color}25`;
  return (
    <div className={cn("flex size-10 items-center justify-center rounded-md", className)} style={{ backgroundColor }}>
      <IconComponent className="size-4" style={{ color: color }} />
    </div>
  );
}
