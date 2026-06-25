import { useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";

import { CurrencyInputField } from "@/components/currency-input-field";
import { DatePicker } from "@/components/date-picker";
import { InputField } from "@/components/input-field";
import { SelectField, type SelectFieldItem } from "@/components/select-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LIST_CATEGORIES_QUERY } from "@/graphql/categories/categories.queries";
import { type CreateTransactionInput, createTransactionSchema } from "@/schemas/transactions/transactions.schema";
import { TransactionTypeSwitch } from "./transaction-type-switch";

const PAGE_LIMIT = 10;

interface CreateTransactionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: CreateTransactionInput, form: UseFormReturn<CreateTransactionInput>) => any;
}

export function CreateTransactionDialog({ open, onOpenChange, onSubmit }: CreateTransactionDialogProps) {
  const [limit] = useState(PAGE_LIMIT);

  const listCategoriesQuery = useQuery(LIST_CATEGORIES_QUERY, {
    variables: {
      page: 1,
      limit,
    },
  });

  const categories = listCategoriesQuery.data?.listCategories.items || [];
  const categoriesPagination = listCategoriesQuery.data?.listCategories.pagination;
  const hasNextCategoriesPage = categoriesPagination?.hasNextPage ?? false;
  const isFetchingMoreCategories = !!categories.length && listCategoriesQuery.loading;

  const loadMoreCategories = async () => {
    if (!hasNextCategoriesPage || listCategoriesQuery.loading) {
      return;
    }

    await listCategoriesQuery.fetchMore({
      variables: {
        page: (categoriesPagination?.page ?? 1) + 1,
        limit,
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

  const form = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      description: "",
      amount: null!,
      categoryId: "",
      date: null!,
      type: null!,
    },
  });

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    form.reset();
  };

  const handleSubmit = async (data: CreateTransactionInput) => {
    await onSubmit?.(data, form);
  };

  const isSubmitting = form.formState.isSubmitting;

  const categoriesOptions: SelectFieldItem[] = categories?.map((category) => ({
    label: category.title,
    value: category.id,
  }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Nova transação</DialogTitle>
            <DialogDescription>Registre sua despesa ou receita</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <TransactionTypeSwitch
                  value={field.value}
                  onValueChange={field.onChange}
                  invalid={!!fieldState.error}
                  helper={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <InputField
              label="Descrição"
              placeholder="Ex. Almoço no restaurante"
              invalid={!!form.formState.errors.description}
              helper={form.formState.errors.description?.message}
              disabled={isSubmitting}
              {...form.register("description")}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    value={field.value || ""}
                    onChange={field.onChange}
                    helper={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              <CurrencyInputField
                label="Valor"
                placeholder="00.00"
                invalid={!!form.formState.errors.amount}
                helper={form.formState.errors.amount?.message}
                disabled={isSubmitting}
                {...form.register("amount", { valueAsNumber: true })}
              />
            </div>

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <SelectField
                  label="Categoria"
                  items={categoriesOptions}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  invalid={!!fieldState.error}
                  helper={fieldState.error?.message}
                  hasNextPage={hasNextCategoriesPage}
                  isFetchingNextPage={isFetchingMoreCategories}
                  onLoadMore={loadMoreCategories}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Salvando" : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
