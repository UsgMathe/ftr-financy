import { ChevronLeft, ChevronRight } from "lucide-react";

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

export function Pagination({ pagination, onPageChange, isLoading = false, className }: PaginationProps) {
  const page = pagination?.page ?? 1;
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const pageSize = pagination?.pageSize ?? totalItems;

  const rangeStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(page * pageSize, totalItems);

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
          <ChevronLeft />
        </Button>

        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="size-9 rounded-lg" />)
          : Array.from({ length: totalPages }).map((_, index) => {
              const currentPage = index + 1;

              return (
                <Button
                  key={currentPage}
                  size="icon"
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => onPageChange(currentPage)}
                >
                  {currentPage}
                </Button>
              );
            })}

        <Button
          size="icon"
          variant="outline"
          disabled={isLoading || !pagination || page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
