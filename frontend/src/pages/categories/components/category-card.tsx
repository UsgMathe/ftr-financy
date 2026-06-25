import * as Icons from "lucide-react";

import { CategoryBadge } from "@/components/category-badge";
import { IconBlock } from "@/components/icon-block";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryModel } from "@/graphql/categories/category.model";

interface CategoryCardProps {
  category: CategoryModel;
  onEdit: (category: CategoryModel) => void;
  onDelete: (category: CategoryModel) => void;
}
export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card key={category.id}>
      <CardHeader className="flex justify-between gap-4">
        <IconBlock icon={category.icon} color={category.color} />

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
        <CategoryBadge color={category.color} title={category.title} />

        <p className="text-muted-foreground text-sm">
          {category.transactionsCount} ite{category.transactionsCount > 1 ? "ns" : "m"}
        </p>
      </CardFooter>
    </Card>
  );
}
