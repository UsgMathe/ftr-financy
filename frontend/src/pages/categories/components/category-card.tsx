import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryModel } from "@/graphql/categories/category.model";
import type { IconName } from "@/types/icon.type";

interface CategoryCardProps {
  category: CategoryModel;
  onEdit: (category: CategoryModel) => void;
  onDelete: (category: CategoryModel) => void;
}
export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const IconComponent = Icons[category.icon as IconName] as LucideIcon;

  const backgroundColor = `${category.color}25`;

  return (
    <Card key={category.id}>
      <CardHeader className="flex justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-md" style={{ backgroundColor }}>
          <IconComponent className="size-4" style={{ color: category.color }} />
        </div>

        <div className="space-x-2">
          <Button variant="outline-destructive" size="icon-sm" onClick={() => onDelete(category)}>
            <Icons.TrashIcon />
          </Button>

          <Button variant="outline" size="icon-sm" onClick={() => onEdit(category)}>
            <Icons.EditIcon />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="h-full">
        <CardTitle className="text-base">{category.title}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Badge style={{ backgroundColor, color: category.color }}>{category.title}</Badge>

        <p className="text-muted-foreground text-sm">
          {category.transactionsCount} ite{category.transactionsCount > 1 ? "ns" : "m"}
        </p>
      </CardFooter>
    </Card>
  );
}
