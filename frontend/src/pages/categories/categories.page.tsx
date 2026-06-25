import { useMutation, useQuery } from "@apollo/client/react";
import { PlusIcon, TagIcon } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import {
  CREATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
} from "@/graphql/categories/categories.mutations";
import { LIST_CATEGORIES_QUERY } from "@/graphql/categories/categories.queries";
import { type CategoryModel } from "@/graphql/categories/category.model";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/schemas/categories/categories.schema";

import { DashboardCard } from "@/components/dashboard-card";
import { PageHeader } from "@/components/page-title";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/utils/error.utils";
import { CategoryCard } from "./components/category-card";
import { CreateCategoryDialog } from "./components/create-category-dialog";
import { DeleteCategoryConfirmationDialog } from "./components/delete-category-confirmation-dialog";
import { UpdateCategoryDialog } from "./components/update-category-dialog";

const PAGE_LIMIT = 10;

export function CategoriesPage() {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryModel>();
  const [deletingCategory, setDeletingCategory] = useState<CategoryModel>();

  const [page, setPage] = useState(1);
  const [limit] = useState(PAGE_LIMIT);

  const { data, previousData, loading, refetch } = useQuery(LIST_CATEGORIES_QUERY, {
    variables: { page, limit },
  });

  const [createCategoryMutation] = useMutation(CREATE_CATEGORY_MUTATION);
  const [upateCategoryMutation] = useMutation(UPDATE_CATEGORY_MUTATION);
  const [deleteCategoryMutation] = useMutation(DELETE_CATEGORY_MUTATION);

  const isFirstLoading = loading && !previousData;

  const currentData = data ?? previousData;

  const categories = currentData?.listCategories.items;
  const pagination = currentData?.listCategories.pagination;

  const totalTransactionsCount = categories?.reduce((prev, cur) => prev + cur.transactionsCount, 0);
  const mostUsedCategory = categories?.reduce<CategoryModel | undefined>(
    (prev, current) => (!prev || current.transactionsCount > prev.transactionsCount ? current : prev),
    undefined,
  );

  const handleCreateCategory = async (data: CreateCategoryInput, form: UseFormReturn<CreateCategoryInput>) => {
    try {
      await createCategoryMutation({ variables: { data } });
      await refetch();
      setIsOpenCreateDialog(false);
      form.reset();
    } catch (error) {
      toast.error("Falha ao criar categoria", {
        description: getErrorMessage(error),
        position: "top-center",
      });
    }
  };

  const handleUpdateCategory = async (
    categoryId: CategoryModel["id"],
    data: UpdateCategoryInput,
    form: UseFormReturn<UpdateCategoryInput>,
  ) => {
    try {
      await upateCategoryMutation({ variables: { categoryId, data } });
      await refetch();
      setEditingCategory(undefined);
      form.reset();
    } catch (error) {
      toast.error("Falha ao editar categoria", {
        description: getErrorMessage(error),
        position: "top-center",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: CategoryModel["id"]) => {
    try {
      await deleteCategoryMutation({ variables: { categoryId } });
      await refetch();
      setDeletingCategory(undefined);
    } catch (error) {
      toast.error("Falha ao excluir categoria", { description: getErrorMessage(error) });
    }
  };

  return (
    <div className="flex flex-1 flex-col space-y-8">
      <CreateCategoryDialog
        open={isOpenCreateDialog}
        onOpenChange={setIsOpenCreateDialog}
        onSubmit={handleCreateCategory}
      />

      <UpdateCategoryDialog
        open={!!editingCategory}
        category={editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(undefined)}
        onSubmit={handleUpdateCategory}
      />

      <DeleteCategoryConfirmationDialog
        category={deletingCategory}
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(undefined)}
        onConfirm={({ id }) => handleDeleteCategory(id)}
        onCancel={() => setDeletingCategory(undefined)}
      />

      <header className="flex items-center justify-between gap-4">
        <PageHeader title="Categorias" description="Organize suas transações por categorias" />

        <Button size="sm" onClick={() => setIsOpenCreateDialog(true)}>
          <PlusIcon />
          <span>Nova categoria</span>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isFirstLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`dashboard-card-skeleton-${index}`} className="h-27" />
          ))
        ) : (
          <>
            <DashboardCard
              icon={"TagIcon"}
              title={categories?.length}
              description="TOTAL DE CATEGORIAS"
              iconColor="var(--color-gray-700)"
            />

            <DashboardCard
              icon={"ArrowUpDownIcon"}
              title={totalTransactionsCount}
              description="TOTAL DE TRANSAÇÕES"
              iconColor="var(--color-purple-base)"
            />

            {mostUsedCategory && (
              <DashboardCard
                icon={mostUsedCategory.icon}
                title={mostUsedCategory?.title}
                description="CATEGORIA MAIS UTILIZADA"
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
      )}

      <Pagination pagination={pagination} onPageChange={setPage} isLoading={isFirstLoading} className="mt-auto" />
    </div>
  );
}
