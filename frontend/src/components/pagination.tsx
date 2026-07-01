import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaginationMetaModel } from "@/graphql/pagination-meta.model";
import { cn } from "@/lib/utils";

interface PaginationProps {
  isLoading?: boolean;
  pagination?: PaginationMetaModel;
  onPageChange: (page: number) => void;
  className?: string;
}

type PaginationItem = number | "left-ellipsis" | "right-ellipsis";

export function Pagination({ pagination, onPageChange, isLoading = false, className }: PaginationProps) {
  const page = pagination?.page ?? 1;
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const pageSize = pagination?.pageSize ?? totalItems;

  const rangeStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  const pages = getPaginationItems(page, totalPages);

  // Define o tamanho do "salto" ao clicar no botão de reticências
  const jumpSize = 5;

  return (
    <div className={cn("flex items-center justify-between py-4", className)}>
      {isLoading ? (
        <Skeleton className="h-4 w-24 rounded" />
      ) : (
        <span className="text-muted-foreground text-sm">
          {rangeStart} a {rangeEnd} | {totalItems} resultados
        </span>
      )}

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          disabled={isLoading || !pagination || page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="size-9 rounded-lg" />)
          : pages.map((item) => {
              if (item === "left-ellipsis") {
                return (
                  <Button
                    key="left-ellipsis"
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground"
                    title={`Voltar ${jumpSize} páginas`}
                    onClick={() => onPageChange(Math.max(1, page - jumpSize))}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                );
              }

              if (item === "right-ellipsis") {
                return (
                  <Button
                    key="right-ellipsis"
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground"
                    title={`Avançar ${jumpSize} páginas`}
                    onClick={() => onPageChange(Math.min(totalPages, page + jumpSize))}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                );
              }

              return (
                <Button
                  key={item}
                  size="icon"
                  variant={page === item ? "default" : "outline"}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </Button>
              );
            })}

        <Button
          size="icon"
          variant="outline"
          disabled={isLoading || !pagination || page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function getPaginationItems(currentPage: number, totalPages: number, siblingCount = 1): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const firstPage = 1;
  const lastPage = totalPages;

  const leftSibling = Math.max(currentPage - siblingCount, 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pages: PaginationItem[] = [firstPage];

  if (showLeftEllipsis) {
    pages.push("left-ellipsis");
  } else {
    for (let i = 2; i < leftSibling; i++) {
      pages.push(i);
    }
  }

  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("right-ellipsis");
  } else {
    for (let i = rightSibling + 1; i < lastPage; i++) {
      pages.push(i);
    }
  }

  pages.push(lastPage);

  return pages;
}
