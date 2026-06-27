import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { CurrencyInputField } from "@/components/currency-input-field";
import { DatePicker } from "@/components/date-picker";
import { InputField } from "@/components/input-field";
import { SelectField, type SelectFieldItem } from "@/components/select-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LIST_CATEGORIES_QUERY } from "@/graphql/categories/categories.queries";
import { TransactionTypeEnum, type TransactionModel } from "@/graphql/transactions/transaction.model";
import { UPDATE_TRANSACTION_MUTATION } from "@/graphql/transactions/transactions.mutations";
import { updateTransactionSchema, type UpdateTransactionInput } from "@/schemas/transactions/transactions.schema";
import { getErrorMessage } from "@/utils/error.utils";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { TransactionTypeSwitch } from "./transaction-type-switch";

const PAGE_LIMIT = 10;

interface UpdateTransactionDialogProps {
  transaction?: TransactionModel;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (data?: TransactionModel) => void;
  onError?: (error: unknown) => void;
}

export function UpdateTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onSuccess,
  onError,
}: UpdateTransactionDialogProps) {
  const [limit] = useState(PAGE_LIMIT);

  const listCategoriesQuery = useQuery(LIST_CATEGORIES_QUERY, {
    variables: {
      page: 1,
      limit,
    },
    fetchPolicy: "cache-and-network",
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

  const form = useForm<UpdateTransactionInput>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      description: undefined,
      amount: undefined,
      categoryId: undefined,
      date: undefined,
      type: undefined,
    },
  });

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    form.reset();
  };

  const [updateTransactionMutation] = useMutation(UPDATE_TRANSACTION_MUTATION);

  const handleUpdateTransaction = async (data: UpdateTransactionInput) => {
    if (!transaction) return;

    try {
      const response = await updateTransactionMutation({ variables: { transactionId: transaction.id, data } });
      onSuccess?.(response.data?.updateTransaction);
      handleOpenChange(false);
    } catch (error) {
      onError?.(error);
      toast.error("Falha ao editar transação", {
        description: getErrorMessage(error),
        position: "top-center",
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  const categoriesOptions: SelectFieldItem[] = categories?.map((category) => ({
    label: category.title,
    value: category.id,
  }));

  useEffect(() => {
    form.reset({
      description: transaction?.description,
      amount: transaction?.amount,
      categoryId: transaction?.category.id,
      date: transaction?.date,
      type: transaction?.type ? TransactionTypeEnum[transaction?.type] : undefined,
    });
  }, [transaction]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleUpdateTransaction)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Editar transação</DialogTitle>
            <DialogDescription>Edite as informações da transação</DialogDescription>
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
                    value={field.value}
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
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                <span>Salvando</span>
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
