import z from "zod";

export const updateUserSchema = z.object({
  name: z
    .string("O nome é obrigatório")
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
});

export type UpdateUserInput = z.input<typeof updateUserSchema>;
