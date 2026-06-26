import { Badge } from "./ui/badge";
interface CategoryBadgeProps {
  color: string;
  title: string;
  className?: string;
}
export function CategoryBadge({ color, title, className }: CategoryBadgeProps) {
  const backgroundColor = `${color}25`;
  {
    return (
      <Badge className={className} style={{ backgroundColor, color: color }}>
        <span className="truncate">{title}</span>
      </Badge>
    );
  }
}
