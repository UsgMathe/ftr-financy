import z from "zod";

import type { UserModel } from "../../graphql/users/user.model";

export const signupSchema = z.object({
  name: z
    .string("O nome é obrigatório")
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),

  email: z.email("O email deve ser válido"),

  password: z.string("A senha é obrigatória").min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type SignupInput = z.input<typeof signupSchema>;

export type SignupOutput = UserModel;
