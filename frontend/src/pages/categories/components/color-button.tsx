import { Button } from "@/components/ui/button";

interface ColorButtonProps {
  color: string;
  selected?: boolean;
  onClick?: (color: string) => void;
}

export function ColorButton({ color, selected, onClick }: ColorButtonProps) {
  const handleClick = () => onClick?.(color);
  return (
    <Button
      aria-selected={selected}
      variant="outline"
      className="aria-selected:border-brand-base h-7.5 w-full p-1"
      size="sm"
      onClick={handleClick}
    >
      <div className="h-full w-full rounded-sm" style={{ backgroundColor: color }} />
    </Button>
  );
}
