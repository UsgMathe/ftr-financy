import type { CreateCategoryInput, UpdateCategoryInput } from "@/schemas/categories/categories.schema";
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
  data: UpdateCategoryInput;
}

export interface ListCategoriesQueryData {
  listCategories: Array<CategoryModel>;
}
