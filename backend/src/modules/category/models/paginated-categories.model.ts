import { ObjectType } from 'type-graphql';
import { createPaginatedModel } from '@/shared/graphql/create-paginated-model.factory';
import { CategoryModel } from './category.model';

@ObjectType()
export class PaginatedCategoriesModel extends createPaginatedModel(CategoryModel) {}
