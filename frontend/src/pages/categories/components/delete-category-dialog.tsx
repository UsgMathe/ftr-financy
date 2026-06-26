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
import { DELETE_CATEGORY_MUTATION } from "@/graphql/categories/categories.mutations";
import type { CategoryModel } from "@/graphql/categories/category.model";
import { getErrorMessage } from "@/utils/error.utils";
import { useMutation } from "@apollo/client/react";
import { Loader2Icon } from "lucide-react";
import type { MouseEvent } from "react";
import { toast } from "sonner";

interface DeleteCategoryDialogProps {
  category?: CategoryModel;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (data?: boolean) => void;
  onError?: (error: unknown) => void;
}
export function DeleteCategoryDialog({ open, category, onOpenChange, onSuccess, onError }: DeleteCategoryDialogProps) {
  const [deleteMutation, { loading }] = useMutation(DELETE_CATEGORY_MUTATION);

  const handleDeleteCategory = async (e: MouseEvent) => {
    if (!category) return;
    e.preventDefault();
    try {
      const response = await deleteMutation({ variables: { categoryId: category.id } });
      onSuccess?.(response.data?.deleteCategory);
      onOpenChange?.(false);
    } catch (error) {
      onError?.(error);
      toast.error("Falha ao excluir categoria", {
        description: getErrorMessage(error),
        position: "top-center",
      });
    }
  };

  const canDelete = category?.transactionsCount === 0;
  const transactionsCount = category?.transactionsCount || 0;

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
              <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCategory} variant="destructive" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    <span>Excluindo</span>
                  </>
                ) : (
                  "Excluir"
                )}
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogCancel disabled={loading}>Entendi</AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
