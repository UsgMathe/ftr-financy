import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { LIST_TRANSACTIONS_QUERY } from "@/graphql/transactions/transactions.queries";
import { useQuery } from "@apollo/client/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { getTransactionsColumns } from "./components/transactions-columns";
import { TransactionsPagination } from "./components/transactions-pagination";
import { Card, CardContent } from "@/components/ui/card";

export function TransactionsPage() {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);

  const listTransactionsQuery = useQuery(LIST_TRANSACTIONS_QUERY);

  const transactions = listTransactionsQuery.data?.listTransactions || [];

  const transactionsColumns = getTransactionsColumns({ onEdit: () => {}, onDelete: () => {} });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <PageHeader title="Transações" description="Gerencie todas as suas transações financeiras" />

        <Button size="sm" onClick={() => setIsOpenCreateDialog(true)}>
          <PlusIcon />
          <span>Nova transação</span>
        </Button>
      </header>

      <DataTable
        columns={transactionsColumns}
        data={transactions}
        pagination={<TransactionsPagination page={1} onPageChange={() => {}} totalItems={3} totalPages={1} />}
      />
    </div>
  );
}
