import { TransactionTypeEnum } from "@/graphql/transactions/transaction.model";
import z from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(TransactionTypeEnum, "O tipo de transação inválido"),
  description: z
    .string("A descrição é obrigatória")
    .trim()
    .min(5, "A descrição deve ter no mínimo 5 caracteres")
    .max(100, "A descrição deve ter no máximo 100 caracteres"),
  data: z.coerce.date("A data é obrigatória"),
  amount: z
    .number({
      message: "O valor deve ser um número",
    })
    .positive("O valor deve ser maior que 0")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "O valor deve ter no máximo 2 casas decimais",
    }),
  categoryId: z.string("Informe a categoria"),
});
