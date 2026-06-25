import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { LIST_TRANSACTIONS_QUERY } from "@/graphql/transactions/transactions.queries";
import { useQuery } from "@apollo/client/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Pagination } from "../../components/pagination";
import { getTransactionsColumns } from "./components/transactions-columns";

const PAGE_LIMIT = 8;

export function TransactionsPage() {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(PAGE_LIMIT);

  const { data, previousData, loading } = useQuery(LIST_TRANSACTIONS_QUERY, {
    variables: { page, limit },
    notifyOnNetworkStatusChange: true,
  });

  const isFirstLoading = loading && !previousData;
  const isFetching = loading && !!previousData;

  const currentData = data ?? previousData;

  const transactions = currentData?.listTransactions.items ?? [];
  const pagination = currentData?.listTransactions.pagination;

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
        isLoading={isFirstLoading}
        isFetching={isFetching}
        data={transactions}
        columns={transactionsColumns}
        skeletonRows={PAGE_LIMIT}
        pagination={<Pagination pagination={pagination} onPageChange={setPage} isLoading={isFirstLoading} />}
      />
    </div>
  );
}
