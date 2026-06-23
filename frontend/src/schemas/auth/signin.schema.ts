import z from "zod";

import type { UserModel } from "../../graphql/users/user.model";

export const signinSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string("A senha é obrigatória").min(6, "A senha deve ter no mínimo 8 caracteres"),
});

export type SigninInput = z.input<typeof signinSchema>;

export type SigninOutput = {
  user: UserModel;
};
