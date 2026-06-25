import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { CREATE_TRANSACTION_MUTATION } from "@/graphql/transactions/transactions.mutations";
import { LIST_TRANSACTIONS_QUERY } from "@/graphql/transactions/transactions.queries";
import type { CreateTransactionInput } from "@/schemas/transactions/transactions.schema";
import { getErrorMessage } from "@/utils/error.utils";
import { useMutation, useQuery } from "@apollo/client/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Pagination } from "../../components/pagination";
import { CreateTransactionDialog } from "./components/create-transaction-dialog";
import { getTransactionsColumns } from "./components/transactions-columns";

const PAGE_LIMIT = 8;

export function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(PAGE_LIMIT);

  const listTransactionsQuery = useQuery(LIST_TRANSACTIONS_QUERY, {
    variables: { page, limit },
    notifyOnNetworkStatusChange: true,
  });

  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);

  const [createTransactionMutation] = useMutation(CREATE_TRANSACTION_MUTATION);

  const handleCreateTransaction = async (data: CreateTransactionInput) => {
    try {
      await createTransactionMutation({ variables: { data } });
      await listTransactionsQuery.refetch();
      setIsOpenCreateDialog(false);
    } catch (error) {
      toast.error("Falha ao adicionar transação", { description: getErrorMessage(error) });
    }
  };

  const isFirstLoading = listTransactionsQuery.loading && !listTransactionsQuery.previousData;
  const isFetching = listTransactionsQuery.loading && !!listTransactionsQuery.previousData;

  const currentData = listTransactionsQuery.data ?? listTransactionsQuery.previousData;

  const transactions = currentData?.listTransactions.items ?? [];
  const pagination = currentData?.listTransactions.pagination;

  const transactionsColumns = getTransactionsColumns({ onEdit: () => {}, onDelete: () => {} });

  return (
    <div className="space-y-8">
      <CreateTransactionDialog
        open={isOpenCreateDialog}
        onOpenChange={setIsOpenCreateDialog}
        onSubmit={handleCreateTransaction}
      />

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
