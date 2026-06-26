import { type MouseEvent } from "react";

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
import type { TransactionModel } from "@/graphql/transactions/transaction.model";
import { DELETE_TRANSACTION_MUTATION } from "@/graphql/transactions/transactions.mutations";
import { getErrorMessage } from "@/utils/error.utils";
import { useMutation } from "@apollo/client/react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

interface DeleteTransactionDialogProps {
  open?: boolean;
  transaction?: TransactionModel;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (data?: boolean) => void;
  onError?: (error: unknown) => void;
}
export function DeleteTransactionDialog({
  open,
  transaction,
  onOpenChange,
  onSuccess,
  onError,
}: DeleteTransactionDialogProps) {
  const [deleteMutation, { loading }] = useMutation(DELETE_TRANSACTION_MUTATION);

  const handleDeleteTransaction = async (e: MouseEvent) => {
    if (!transaction) return;
    e.preventDefault();
    try {
      const response = await deleteMutation({ variables: { transactionId: transaction.id } });
      onSuccess?.(response.data?.deleteTransaction);
      onOpenChange?.(false);
    } catch (error) {
      onError?.(error);
      toast.error("Falha ao excluir transação", {
        description: getErrorMessage(error),
        position: "top-center",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta transação? Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteTransaction} variant="destructive" disabled={loading}>
            {loading ? (
              <>
                <Loader2Icon className="animate-spin" />
                <span>Excluindo</span>
              </>
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
