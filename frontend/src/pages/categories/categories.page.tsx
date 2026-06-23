import { useQuery } from "@apollo/client/react";
import * as Icons from "lucide-react";
import { ArrowUpDownIcon, PlusIcon, TagIcon } from "lucide-react";

import { DashboardCard } from "@/components/dashboard-card";
import { Button } from "@/components/ui/button";
import { LIST_CATEGORIES_QUERY } from "@/graphql/categories/categories.queries";
import { CategoryCard } from "./components/category-card";

export function CategoriesPage() {
  const listCategoriesQuery = useQuery(LIST_CATEGORIES_QUERY);
  const categories = listCategoriesQuery.data?.listCategories;

  const totalTransactionsCount = categories?.reduce((prev, cur) => prev + cur.transactionsCount, 0);
  const mostUsedCategory = categories?.reduce((prev, current) =>
    current.transactionsCount > prev.transactionsCount ? current : prev,
  );

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <h2 className="text-description text-base font-normal">Organize suas transações por categorias</h2>
        </div>

        <Button size="sm">
          <PlusIcon />
          <span>Nova categoria</span>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listCategoriesQuery.loading ? (
          "a"
        ) : (
          <>
            <DashboardCard
              icon={TagIcon}
              title={categories?.length}
              description="TOTAL DE CATEGORIAS"
              iconColor="var(--color-gray-700)"
            />

            <DashboardCard
              icon={ArrowUpDownIcon}
              title={totalTransactionsCount}
              description="TOTAL DE TRANSAÇÕES"
              iconColor="var(--color-purple-base)"
            />

            <DashboardCard
              icon={Icons[mostUsedCategory.icon]}
              title={mostUsedCategory.title}
              description="CATEGORIA MAIS UTILIZADA"
              iconColor={mostUsedCategory.color}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
