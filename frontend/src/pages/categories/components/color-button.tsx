import { Button, type ButtonProps } from "@/components/ui/button";

interface ColorButtonProps extends Omit<ButtonProps, "onClick"> {
  color: string;
  selected?: boolean;
  onClick?: (color: string) => void;
}

export function ColorButton({ color, selected, onClick, ...props }: ColorButtonProps) {
  const handleClick = () => onClick?.(color);
  return (
    <Button
      aria-selected={selected}
      variant="outline"
      className="aria-selected:border-brand-base h-7.5 w-full p-1"
      size="sm"
      onClick={handleClick}
      {...props}
    >
      <div className="h-full w-full rounded-sm" style={{ backgroundColor: color }} />
    </Button>
  );
}
