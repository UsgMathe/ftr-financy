import { useQuery } from "@apollo/client/react";
import { ArrowDownCircleIcon, ArrowUpCircleIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { LIST_TRANSACTIONS_QUERY } from "@/graphql/transactions/transactions.queries";
import { TransactionOrderFieldEnum } from "@/graphql/transactions/transactions.types";
import { usePaginatedCategoriesQuery } from "@/hooks/use-paginated-categories-query";
import { formatCurrency } from "@/utils/format-currency";
import { APP_ROUTES_PATHS } from "./routes/app-routes-paths";

import { CategoryBadge } from "@/components/category-badge";
import { DashboardCard } from "@/components/dashboard-card";
import { IconBlock } from "@/components/icon-block";
import { AmountText } from "@/components/transaction-amount-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LIST_CATEGORIES_QUERY } from "@/graphql/categories/categories.queries";
import { CategoryOrderFieldEnum } from "@/graphql/categories/categories.types";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { CreateTransactionDialog } from "./transactions/components/create-transaction-dialog";

const now = new Date();

export function DashboardPage() {
  const listAllTransactionsQuery = useQuery(LIST_TRANSACTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const listRecentTransactionsQuery = useQuery(LIST_TRANSACTIONS_QUERY, {
    variables: {
      limit: 5,
      filters: {
        orderBy: {
          field: TransactionOrderFieldEnum.DATE,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const listMonthTransactionsQuery = useQuery(LIST_TRANSACTIONS_QUERY, {
    variables: {
      filters: {
        startDate: format(startOfMonth(now), "yyyy-MM-dd"),
        endDate: format(endOfMonth(now), "yyyy-MM-dd"),
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const { listCategoriesQuery, loadMoreCategories } = usePaginatedCategoriesQuery();

  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);

  const totalBalance = listAllTransactionsQuery.data?.listTransactions.totalBalance;

  const recentTransactions = listRecentTransactionsQuery.data?.listTransactions.items;

  const monthTotalIncome = listMonthTransactionsQuery.data?.listTransactions.totalIncomeAmount;

  const monthTotalExpenseAmount = listMonthTransactionsQuery.data?.listTransactions.totalExpenseAmount;

  const mostUsedCategoriesQuery = useQuery(LIST_CATEGORIES_QUERY, {
    variables: { limit: 5, filters: { orderBy: { field: CategoryOrderFieldEnum.TRANSACTIONS_COUNT } } },
    fetchPolicy: "cache-and-network",
  });

  const mostUsedCategories = mostUsedCategoriesQuery.data?.listCategories.items;

  const isLoadingInfos = listMonthTransactionsQuery.loading;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard
          isLoading={isLoadingInfos}
          variant="highlight"
          label="SALDO TOTAL"
          value={formatCurrency(totalBalance || 0)}
          icon={"Wallet"}
          iconColor="var(--purple-base)"
        />
        <DashboardCard
          isLoading={isLoadingInfos}
          variant="highlight"
          label="RECEITAS DO MÊS"
          value={formatCurrency(monthTotalIncome || 0)}
          icon={"ArrowUpCircle"}
          iconColor="var(--primary)"
        />
        <DashboardCard
          isLoading={isLoadingInfos}
          variant="highlight"
          label="DESPESAS DO MÊS"
          value={formatCurrency(monthTotalExpenseAmount || 0)}
          icon={"ArrowDownCircle"}
          iconColor="var(--danger)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="pb-0 lg:col-span-2">
          <CardHeader className="flex items-center justify-between gap-4">
            <CardTitle className="text-muted-foreground text-xs tracking-wide">TRANSAÇÕES RECENTES</CardTitle>
            <Link to={APP_ROUTES_PATHS.TRANSACTIONS}>
              <Button variant={"ghost"} className="text-primary hover:text-primary h-fit px-0 hover:bg-transparent">
                <span>Ver todas</span>
                <ChevronRightIcon className="size-5" />
              </Button>
            </Link>
          </CardHeader>

          <div>
            <Separator />
            {recentTransactions?.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <div className="grid grid-cols-5 items-center gap-4 p-5">
                  <div className="col-span-3 flex items-center gap-4">
                    <IconBlock
                      color={transaction.category.color}
                      icon={transaction.category.icon}
                      className="flex-none"
                    />
                    <div>
                      <p className="text-base font-medium">{transaction.description}</p>
                      <p className="text-muted-foreground text-sm">{format(transaction.date, "dd/MM/yyyy")}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <CategoryBadge color={transaction.category.color} title={transaction.category.title} />
                  </div>

                  <div className="flex flex-nowrap items-center justify-end gap-2">
                    <AmountText amount={transaction.amount} type={transaction.type} />

                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownCircleIcon className="text-danger size-4 flex-none" />
                    ) : (
                      <ArrowUpCircleIcon className="text-primary size-4 flex-none" />
                    )}
                  </div>
                </div>
                <Separator />
              </React.Fragment>
            ))}

            <Button
              variant={"ghost"}
              className="text-primary hover:text-primary w-full p-7 hover:bg-transparent"
              onClick={() => setIsOpenCreateDialog(true)}
            >
              <PlusIcon />
              <span>Nova transação</span>
            </Button>
          </div>
        </Card>

        <Card className="h-fit">
          <CardHeader className="flex items-center justify-between gap-4 border-b">
            <CardTitle className="text-muted-foreground text-xs tracking-wide">CATEGORIAS</CardTitle>

            <Link to={APP_ROUTES_PATHS.CATEGORIES}>
              <Button variant={"ghost"} className="text-primary hover:text-primary h-fit px-0 hover:bg-transparent">
                <span>Gerenciar</span>
                <ChevronRightIcon className="size-5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-4">
            {mostUsedCategories?.map((category) => (
              <div key={category.id} className="flex items-center">
                <div className="min-w-0 flex-1">
                  <CategoryBadge className="max-w-full" color={category.color} title={category.title} />
                </div>

                <div className="ml-6 flex items-center gap-6">
                  <p className="text-muted-foreground text-sm whitespace-nowrap">
                    {category.transactionsCount} {category.transactionsCount === 1 ? "item" : "itens"}
                  </p>

                  <div className="min-w-[90px] text-right">
                    <AmountText amount={category.totalAmount} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <CreateTransactionDialog
        open={isOpenCreateDialog}
        listCategoriesQuery={listCategoriesQuery}
        loadMoreCategories={loadMoreCategories}
        onOpenChange={setIsOpenCreateDialog}
        onSuccess={async () => {
          await listRecentTransactionsQuery.refetch();
          toast.success("Transação adicionada com sucesso");
        }}
      />
    </div>
  );
}
