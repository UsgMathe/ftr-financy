export interface CategoryModel {
  id: string;
  title: string;
  description: string | null;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  transactionsCount: number;
}
