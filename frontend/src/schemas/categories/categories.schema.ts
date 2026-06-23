import * as Icon from "lucide-react";
import z from "zod";

const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;

export const createCategorySchema = z.object({
  title: z
    .string("O título é obrigatório")
    .trim()
    .min(3, "O título deve ter no mínimo 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),

  description: z.string().trim().max(255, "A descrição deve ter no máximo 255 caracteres").optional(),

  icon: z.enum(Object.keys(Icon) as [keyof typeof Icon, ...(keyof typeof Icon)[]]),

  color: z.string().regex(HEX_COLOR_REGEX, "A cor deve estar no formato hexadecimal (#RRGGBB)"),
});

export type CreateCategoryInput = z.input<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
