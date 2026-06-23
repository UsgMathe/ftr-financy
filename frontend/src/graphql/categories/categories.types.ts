import type { CategoryModel } from "./category.model";

export interface CreateCategoryMutationData {
  createCategory: CategoryModel;
}

export interface UpdateCategoryMutationData {
  updateCategory: CategoryModel;
}

export interface ListCategoriesQueryData {
  listCategories: Array<CategoryModel>;
}
