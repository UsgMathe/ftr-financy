import { LIST_CATEGORIES_QUERY } from "@/graphql/categories/categories.queries";
import { useQuery } from "@apollo/client/react";

const PAGE_LIMIT = 10;

export function usePaginatedCategoriesQuery() {
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

  return {
    listCategoriesQuery,
    loadMoreCategories,
  };
}
