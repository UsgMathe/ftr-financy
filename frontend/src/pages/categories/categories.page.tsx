import { useQuery } from "@apollo/client/react";
import { PlusIcon, TagIcon } from "lucide-react";
import { useState } from "react";

import { LIST_CATEGORIES_QUERY } from "@/graphql/categories/categories.queries";
import { type CategoryModel } from "@/graphql/categories/category.model";

import { DashboardCard } from "@/components/dashboard-card";
import { LoadingContainer } from "@/components/loading-container";
import { PageHeader } from "@/components/page-title";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCard } from "./components/category-card";
import { CreateCategoryDialog } from "./components/create-category-dialog";
import { DeleteCategoryDialog } from "./components/delete-category-dialog";
import { UpdateCategoryDialog } from "./components/update-category-dialog";

const PAGE_LIMIT = 10;

export function CategoriesPage() {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryModel>();
  const [deletingCategory, setDeletingCategory] = useState<CategoryModel>();

  const [page, setPage] = useState(1);
  const [limit] = useState(PAGE_LIMIT);

  const listCategoriesQuery = useQuery(LIST_CATEGORIES_QUERY, {
    variables: { page, limit },
    refetchOn: { windowFocus: true },
    fetchPolicy: "cache-and-network",
  });

  const isFirstLoading = listCategoriesQuery.loading && !listCategoriesQuery.previousData;
  const isFetching = listCategoriesQuery.loading && !!listCategoriesQuery.previousData;

  const currentData = listCategoriesQuery.data ?? listCategoriesQuery.previousData;

  const categories = currentData?.listCategories.items;
  const pagination = currentData?.listCategories.pagination;

  const totalTransactionsCount = categories?.reduce((prev, cur) => prev + cur.transactionsCount, 0);
  const mostUsedCategory = categories?.reduce<CategoryModel | undefined>(
    (prev, current) => (!prev || current.transactionsCount > prev.transactionsCount ? current : prev),
    undefined,
  );

  return (
    <div className="flex flex-1 flex-col space-y-8">
      <header className="flex items-center justify-between gap-4">
        <PageHeader title="Categorias" description="Organize suas transações por categorias" />

        <Button size="sm" onClick={() => setIsOpenCreateDialog(true)}>
          <PlusIcon />
          <span>Nova categoria</span>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {isFirstLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`dashboard-card-skeleton-${index}`} className="h-27" />
          ))
        ) : (
          <>
            <DashboardCard
              icon={"TagIcon"}
              value={categories?.length}
              label="TOTAL DE CATEGORIAS"
              iconColor="var(--color-gray-700)"
            />

            <DashboardCard
              icon={"ArrowUpDownIcon"}
              value={totalTransactionsCount}
              label="TOTAL DE TRANSAÇÕES"
              iconColor="var(--color-purple-base)"
            />

            {mostUsedCategory && (
              <DashboardCard
                icon={mostUsedCategory.icon}
                value={mostUsedCategory?.title}
                label="CATEGORIA MAIS UTILIZADA"
                iconColor={mostUsedCategory?.color}
              />
            )}
          </>
        )}
      </div>

      {!isFirstLoading && categories?.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TagIcon className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Nenhuma categoria encontrada</EmptyTitle>
            <EmptyDescription>Crie uma nova categoria para começar a organizar suas transações.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setIsOpenCreateDialog(true)}>
              <PlusIcon />
              <span>Criar categoria</span>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <LoadingContainer isLoading={isFetching}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {isFirstLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={`category-card-skeleton-${index}`} className="h-52" />
                ))
              : categories?.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={setEditingCategory}
                    onDelete={setDeletingCategory}
                  />
                ))}
          </div>
        </LoadingContainer>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} isLoading={isFirstLoading} className="mt-auto" />

      <CreateCategoryDialog
        open={isOpenCreateDialog}
        onOpenChange={setIsOpenCreateDialog}
        onSuccess={() => listCategoriesQuery.refetch()}
      />

      <UpdateCategoryDialog
        open={!!editingCategory}
        category={editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(undefined)}
        onSuccess={() => listCategoriesQuery.refetch()}
      />

      <DeleteCategoryDialog
        category={deletingCategory}
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(undefined)}
        onSuccess={() => listCategoriesQuery.refetch()}
      />
    </div>
  );
}
