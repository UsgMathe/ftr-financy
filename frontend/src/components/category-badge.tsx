import { Badge } from "./ui/badge";
interface CategoryBadgeProps {
  color: string;
  title: string;
}
export function CategoryBadge({ color, title }: CategoryBadgeProps) {
  const backgroundColor = `${color}25`;
  {
    return <Badge style={{ backgroundColor, color: color }}>{title}</Badge>;
  }
}
