import type { CreateCategoryInput, UpdateCategoryInput } from "@/schemas/categories/categories.schema";
import type { OrderDirectionEnum, PaginatedQueryData, PaginatedQueryVariables } from "../graphql.types";
import type { CategoryModel } from "./category.model";

export enum CategoryOrderFieldEnum {
  TITLE = "TITLE",
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
  TRANSACTIONS_COUNT = "TRANSACTIONS_COUNT",
}

export interface CategoryOrderByVariables {
  field?: CategoryOrderFieldEnum;
  direction?: OrderDirectionEnum;
}

export interface CreateCategoryMutationData {
  createCategory: CategoryModel;
}

export interface CreateCategoryMutationVariables {
  data: CreateCategoryInput;
}

export interface UpdateCategoryMutationData {
  updateCategory: CategoryModel;
}

export interface UpdateCategoryMutationVariables {
  categoryId: CategoryModel["id"];
  data: UpdateCategoryInput;
}

export interface ListCategoriesQueryData {
  listCategories: PaginatedQueryData<CategoryModel>;
}

export interface ListCategoryFilters {
  search?: string;
  orderBy?: CategoryOrderByVariables;
}

export interface ListCategoriesQueryVariables extends PaginatedQueryVariables {
  filters?: ListCategoryFilters;
}

export interface DeleteCategoryMutationData {
  deleteCategory: boolean;
}

export interface DeleteCategoryMutationVariables {
  categoryId: CategoryModel["id"];
}
