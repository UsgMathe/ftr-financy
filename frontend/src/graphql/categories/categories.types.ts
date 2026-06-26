import type { CreateCategoryInput, UpdateCategoryInput } from "@/schemas/categories/categories.schema";
import type { PaginatedQueryData } from "../graphql.types";
import type { CategoryModel } from "./category.model";

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

export interface DeleteCategoryMutationData {
  deleteCategory: boolean;
}

export interface DeleteCategoryMutationVariables {
  categoryId: CategoryModel["id"];
}
