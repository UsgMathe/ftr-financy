import { type ColumnDef } from "@tanstack/react-table";
import { ArrowDownCircle, ArrowUpCircle, EditIcon, TrashIcon } from "lucide-react";

import { CategoryBadge } from "@/components/category-badge";
import { IconBlock } from "@/components/icon-block";
import { Button } from "@/components/ui/button";
import { TransactionTypeEnum, type TransactionModel } from "@/graphql/transactions/transaction.model";
import { formatCurrency } from "@/utils/format-currency";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

type TransactionsColumnsProps = {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function getTransactionsColumns({ onEdit, onDelete }: TransactionsColumnsProps): ColumnDef<TransactionModel>[] {
  return [
    {
      accessorKey: "description",
      header: "DESCRIÇÃO",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <IconBlock icon={row.original.category.icon} color={row.original.category.color} />
          <div className="text-base font-medium">{row.original.description}</div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center">DATA</div>,
      cell: ({ row }) => {
        return <div className="text-muted-foreground text-center">{dayjs(row.original.date).format("DD/MM/YY")}</div>;
      },
    },
    {
      accessorKey: "category",
      header: () => <div className="text-center">CATEGORIA</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <CategoryBadge color={row.original.category.color} title={row.original.category.title} />
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div className="text-center">TIPO</div>,
      cell: ({ row }) => {
        const isIncome = row.original.type === TransactionTypeEnum.INCOME;

        return (
          <div className={"flex items-center justify-center gap-2"}>
            {isIncome ? (
              <ArrowUpCircle className="text-primary h-4 w-4" />
            ) : (
              <ArrowDownCircle className="text-red-base h-4 w-4" />
            )}

            <p className={cn(isIncome ? "text-green-dark" : "text-red-dark")}>{isIncome ? "Entrada" : "Saída"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">VALOR</div>,
      cell: ({ row }) => {
        const isIncome = row.original.type === TransactionTypeEnum.INCOME;

        return (
          <div className="text-right text-base font-semibold">
            {isIncome ? "+" : "-"} {formatCurrency(row.original.amount)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">AÇÕES</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" onClick={() => onDelete(row.original.id)}>
            <TrashIcon className="text-destructive size-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => onEdit(row.original.id)}>
            <EditIcon className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
