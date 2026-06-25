import { ClassType, Field, ObjectType } from 'type-graphql';
import { PaginationMetaModel } from './pagination-meta.model';

export function createPaginatedModel<T extends object>(ItemType: ClassType<T>) {
  @ObjectType(`Paginated${ItemType.name}`)
  abstract class PaginatedModel {
    @Field(() => [ItemType])
    items!: T[];

    @Field(() => PaginationMetaModel)
    pagination!: PaginationMetaModel;
  }

  return PaginatedModel;
}

export interface PaginationInput {
  page: number;
  limit: number;
}

export function buildPaginationMeta(
  totalItems: number,
  { page, limit }: PaginationInput,
): PaginationMetaModel {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    pageSize: limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
