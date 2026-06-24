import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CategoryModel } from "@/graphql/categories/category.model";

interface DeleteCategoryConfirmationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  category?: CategoryModel;
  onConfirm?: (category: CategoryModel) => void;
  onCancel?: (category: CategoryModel) => void;
}
export function DeleteCategoryConfirmationDialog({
  open,
  onOpenChange,

  category,
  onConfirm,
  onCancel,
}: DeleteCategoryConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta categoria? Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => category && onCancel?.(category)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => category && onConfirm?.(category)} variant="destructive">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
