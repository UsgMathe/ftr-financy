import { Button, type ButtonProps } from "@/components/ui/button";
import type { IconName } from "@/types/icon.type";
import * as Icons from "lucide-react";

interface IconButtonProps extends Omit<ButtonProps, "onClick"> {
  selected?: boolean;
  icon: IconName;
  onClick?: (icon: IconName) => void;
}

export function IconButton({ icon, selected, onClick, ...props }: IconButtonProps) {
  const IconComponent = Icons[icon] as Icons.LucideIcon;

  const handleClick = () => onClick?.(icon);

  return (
    <Button
      variant="outline"
      aria-selected={selected}
      className="aria-selected:border-brand-base aspect-square h-fit max-h-10.5"
      onClick={handleClick}
      {...props}
    >
      <IconComponent
        aria-selected={selected}
        className="text-muted-foreground size-5 transition-colors aria-selected:text-gray-600"
      />
    </Button>
  );
}
