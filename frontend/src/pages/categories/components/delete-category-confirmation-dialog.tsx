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
import { useState, type MouseEvent } from "react";

interface DeleteCategoryConfirmationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  category?: CategoryModel;
  onConfirm?: (category: CategoryModel) => any;
  onCancel?: (category: CategoryModel) => any;
}
export function DeleteCategoryConfirmationDialog({
  open,
  onOpenChange,

  category,
  onConfirm,
  onCancel,
}: DeleteCategoryConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const canDelete = category?.transactionsCount === 0;
  const transactionsCount = category?.transactionsCount || 0;

  const handleConfirm = async (e: MouseEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      if (category) await onConfirm?.(category);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (e: MouseEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      if (category) await onCancel?.(category);
    } finally {
      setIsLoading(false);
      onOpenChange?.(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {canDelete ? "Excluir categoria?" : "Não é possível excluir esta categoria"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              "Tem certeza que deseja excluir esta categoria? Esta ação não poderá ser desfeita."
            ) : (
              <>
                <span>
                  A categoria possui {transactionsCount} transa{transactionsCount > 1 ? "ções" : "ção"} vinculada
                  {transactionsCount > 1 ? "s" : ""} e não pode ser excluída.
                </span>

                <br />

                <span>
                  Para continuar, remova ou altere a categoria dessa{transactionsCount > 1 ? "s" : ""} transa
                  {transactionsCount > 1 ? "ções" : "ção"}.
                </span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {canDelete ? (
            <>
              <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm} variant="destructive" disabled={isLoading}>
                {isLoading ? "Excluindo" : "Excluir"}
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
              Entendi
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
