import { cn } from "@/lib/utils";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { ArrowDownCircleIcon, ArrowUpCircleIcon, EditIcon, TrashIcon } from "lucide-react";

import { TransactionTypeEnum, type TransactionModel } from "@/graphql/transactions/transaction.model";

import { CategoryBadge } from "@/components/category-badge";
import { IconBlock } from "@/components/icon-block";
import { AmountText } from "@/components/transaction-amount-text";
import { Button } from "@/components/ui/button";

type TransactionsColumnsProps = {
  onEdit: (transaction: TransactionModel) => void;
  onDelete: (transaction: TransactionModel) => void;
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
        const date = typeof row.original.date === "string" ? parseISO(row.original.date) : row.original.date;

        return <div className="text-muted-foreground text-center">{format(date, "dd/MM/yy")}</div>;
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
              <ArrowUpCircleIcon className="text-primary h-4 w-4" />
            ) : (
              <ArrowDownCircleIcon className="text-red-base h-4 w-4" />
            )}

            <p className={cn(isIncome ? "text-green-dark" : "text-red-dark")}>{isIncome ? "Entrada" : "Saída"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">VALOR</div>,
      cell: ({ row }) => <AmountText amount={row.original.amount} type={row.original.type} />,
    },
    {
      id: "actions",
      header: () => <div className="text-right">AÇÕES</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" onClick={() => onDelete(row.original)}>
            <TrashIcon className="text-destructive size-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => onEdit(row.original)}>
            <EditIcon className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
