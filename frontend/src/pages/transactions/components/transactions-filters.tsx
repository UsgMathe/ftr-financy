import type { useQuery } from "@apollo/client/react";
import { SearchIcon } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import type { ListCategoriesQueryData } from "@/graphql/categories/categories.types";
import type { PaginatedQueryVariables } from "@/graphql/graphql.types";
import { TransactionTypeEnum, type TransactionType } from "@/graphql/transactions/transaction.model";
import type { ListTransactionFilters } from "@/graphql/transactions/transactions.types";
import { useDebounce } from "@/hooks/use-debounce";

import { DateRangePicker } from "@/components/date-range-picker";
import { InputField } from "@/components/input-field";
import { SelectField, type SelectFieldItem } from "@/components/select-field";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionsFiltersProps {
  listCategoriesQuery: ReturnType<typeof useQuery<ListCategoriesQueryData, PaginatedQueryVariables>>;
  loadMoreCategories: () => void;
  filters?: ListTransactionFilters;
  setFilters: Dispatch<SetStateAction<ListTransactionFilters>>;
}

export function TransactionsFilters({
  listCategoriesQuery,
  loadMoreCategories,
  filters,
  setFilters,
}: TransactionsFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters?.search || "");

  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setLocalSearch(filters?.search || "");
  }, [filters?.search]);

  useEffect(() => {
    setFilters((prev) => {
      const newSearchValue = debouncedSearch || undefined;
      if (prev.search === newSearchValue) return prev;

      return { ...prev, search: newSearchValue };
    });
  }, [debouncedSearch, setFilters]);

  const categories = listCategoriesQuery.data?.listCategories.items || [];
  const categoriesPagination = listCategoriesQuery.data?.listCategories.pagination;
  const hasNextCategoriesPage = categoriesPagination?.hasNextPage ?? false;
  const isFetchingMoreCategories = !!categories.length && listCategoriesQuery.loading;

  const categoriesOptions: SelectFieldItem[] = categories?.map((category) => ({
    label: category.title,
    value: category.id,
  }));

  const transactionTypesOptions = [
    { label: "Despesa", value: TransactionTypeEnum.EXPENSE },
    { label: "Receita", value: TransactionTypeEnum.INCOME },
  ];

  const dateRange = {
    from: filters?.startDate,
    to: filters?.endDate,
  };

  return (
    <Card>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InputField
          label="Buscar"
          placeholder="Buscar por descrição"
          icon={<SearchIcon />}
          value={localSearch}
          onValueChange={setLocalSearch}
        />

        <SelectField
          isClearable
          label="Tipo"
          items={transactionTypesOptions}
          value={filters?.type}
          onValueChange={(type) =>
            setFilters((prev) => ({ ...prev, type: TransactionTypeEnum[type as TransactionType] }))
          }
        />

        <SelectField
          isClearable
          label="Categoria"
          items={categoriesOptions}
          hasNextPage={hasNextCategoriesPage}
          isFetchingNextPage={isFetchingMoreCategories}
          onLoadMore={loadMoreCategories}
          value={filters?.categoryId}
          onValueChange={(categoryId) => setFilters((prev) => ({ ...prev, categoryId }))}
        />

        <DateRangePicker
          label="Período"
          value={dateRange}
          onChange={(newDateRange) =>
            setFilters((prev) => ({
              ...prev,
              startDate: newDateRange?.from,
              endDate: newDateRange?.to,
            }))
          }
        />
      </CardContent>
    </Card>
  );
}
