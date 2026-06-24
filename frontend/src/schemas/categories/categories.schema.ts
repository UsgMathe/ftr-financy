import z from "zod";

export const createCategorySchema = z.object({
  title: z
    .string("O título é obrigatório")
    .trim()
    .min(3, "O título deve ter no mínimo 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),

  description: z.string().trim().max(255, "A descrição deve ter no máximo 255 caracteres").optional(),

  icon: z.string("Selecione um ícone").min(1, "Selecione um ícone").trim(),

  color: z.string("Selecione uma cor").min(1, "Selecione uma cor").trim(),
});

export type CreateCategoryInput = z.input<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
