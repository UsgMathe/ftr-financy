import type { IconName } from "@/types/icon.type";

export interface CategoryModel {
  id: string;
  title: string;
  description: string | null;
  color: string;
  icon: IconName;
  createdAt: string;
  updatedAt: string;
  transactionsCount: number;
}
