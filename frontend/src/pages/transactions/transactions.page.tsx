import { useQuery } from "@apollo/client/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { LIST_CATEGORIES_QUERY } from "@/graphql/categories/categories.queries";
import { type TransactionModel } from "@/graphql/transactions/transaction.model";
import { LIST_TRANSACTIONS_QUERY } from "@/graphql/transactions/transactions.queries";

import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-title";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import type { ListTransactionFilters } from "@/graphql/transactions/transactions.types";
import { CreateTransactionDialog } from "./components/create-transaction-dialog";
import { DeleteTransactionDialog } from "./components/delete-transaction-dialog";
import { getTransactionsColumns } from "./components/transactions-columns";
import { TransactionsFilters } from "./components/transactions-filters";
import { UpdateTransactionDialog } from "./components/update-transaction-dialog";

const PAGE_LIMIT = 8;

export function TransactionsPage() {
  const [page, setPage] = useState(1);

  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionModel>();
  const [deletingTransaction, setDeletingTransaction] = useState<TransactionModel>();
  const [transactionsFilters, setTransactionsFilters] = useState<ListTransactionFilters>({
    search: undefined,
    categoryId: undefined,
    type: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const listTransactionsQuery = useQuery(LIST_TRANSACTIONS_QUERY, {
    variables: { page, limit: PAGE_LIMIT, filters: transactionsFilters },
    fetchPolicy: "network-only",
  });

  const listCategoriesQuery = useQuery(LIST_CATEGORIES_QUERY, {
    variables: {
      page: 1,
      limit: PAGE_LIMIT,
    },
  });

  const categoriesPagination = listCategoriesQuery.data?.listCategories.pagination;
  const hasNextCategoriesPage = categoriesPagination?.hasNextPage ?? false;

  const loadMoreCategories = async () => {
    if (!hasNextCategoriesPage || listCategoriesQuery.loading) {
      return;
    }

    await listCategoriesQuery.fetchMore({
      variables: {
        page: (categoriesPagination?.page ?? 1) + 1,
        limit: PAGE_LIMIT,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;

        return {
          ...previousResult,
          listCategories: {
            ...fetchMoreResult.listCategories,
            items: [...previousResult.listCategories.items, ...fetchMoreResult.listCategories.items],
          },
        };
      },
    });
  };

  const handleSetFilters = (newFilters: React.SetStateAction<ListTransactionFilters>) => {
    setPage(1);
    setTransactionsFilters(newFilters);
  };

  const isFirstLoading = listTransactionsQuery.loading && !listTransactionsQuery.previousData;
  const isFetching = listTransactionsQuery.loading && !!listTransactionsQuery.previousData;

  const currentData = listTransactionsQuery.data ?? listTransactionsQuery.previousData;

  const transactions = currentData?.listTransactions.items ?? [];
  const pagination = currentData?.listTransactions.pagination;

  const transactionsColumns = getTransactionsColumns({
    onEdit: setEditingTransaction,
    onDelete: setDeletingTransaction,
  });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <PageHeader title="Transações" description="Gerencie todas as suas transações financeiras" />

        <Button size="sm" onClick={() => setIsOpenCreateDialog(true)}>
          <PlusIcon />
          <span>Nova transação</span>
        </Button>
      </header>

      <TransactionsFilters
        filters={transactionsFilters}
        setFilters={handleSetFilters}
        listCategoriesQuery={listCategoriesQuery}
        loadMoreCategories={loadMoreCategories}
      />

      <DataTable
        isLoading={isFirstLoading}
        isFetching={isFetching}
        data={transactions}
        columns={transactionsColumns}
        skeletonRows={PAGE_LIMIT}
        pagination={<Pagination pagination={pagination} onPageChange={setPage} isLoading={isFirstLoading} />}
      />

      <CreateTransactionDialog
        listCategoriesQuery={listCategoriesQuery}
        loadMoreCategories={loadMoreCategories}
        open={isOpenCreateDialog}
        onOpenChange={setIsOpenCreateDialog}
        onSuccess={() => listTransactionsQuery.refetch()}
      />

      <UpdateTransactionDialog
        transaction={editingTransaction}
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(undefined)}
        onSuccess={() => listTransactionsQuery.refetch()}
      />

      <DeleteTransactionDialog
        transaction={deletingTransaction}
        open={!!deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(undefined)}
        onSuccess={() => listTransactionsQuery.refetch()}
      />
    </div>
  );
}
