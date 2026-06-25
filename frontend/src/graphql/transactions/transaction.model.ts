import type { CategoryModel } from "../categories/category.model";

export enum TransactionTypeEnum {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export type TransactionType = keyof typeof TransactionTypeEnum;

export interface TransactionModel {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: CategoryModel;
  createdAt: string;
  updatedAt: string;
}
