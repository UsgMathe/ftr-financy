import type { PaginationMetaModel } from "./pagination-meta.model";

export type PaginatedQueryData<T> = {
  items: T[];
  pagination: PaginationMetaModel;
};

export interface PaginatedQueryVariables {
  page?: number;
  limit?: number;
}

export enum OrderDirectionEnum {
  ASC = "ASC",
  DESC = "DESC",
}
