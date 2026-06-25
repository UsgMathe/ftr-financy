import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TransactionsPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function TransactionsPagination({ page, totalPages, totalItems, onPageChange }: TransactionsPaginationProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-muted-foreground text-sm">{totalItems} resultados</span>

      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft />
        </Button>

        {Array.from({ length: totalPages }).map((_, index) => {
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

        <Button size="icon" variant="outline" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
