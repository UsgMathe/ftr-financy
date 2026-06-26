import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingContainer } from "./loading-container";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: ReactNode;
  isLoading?: boolean;
  isFetching?: boolean;
  skeletonRows?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  isLoading = false,
  isFetching = false,
  skeletonRows = 6,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="bg-background overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-14">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground text-xs font-medium tracking-wide">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="h-10">
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-5 w-full rounded-md" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pagination && <div className="border-t px-6">{pagination}</div>}
      </div>
    );
  }

  return (
    <div className="bg-background relative overflow-hidden rounded-2xl border">
      <LoadingContainer isLoading={isFetching}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-14">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground text-xs font-medium tracking-wide">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="h-10">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-10 text-center">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </LoadingContainer>

      {pagination && <div className="border-t px-6">{pagination}</div>}
    </div>
  );
}
