import z from "zod";

import type { UserOutput } from "../users/users.schema";

export const signinSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string("A senha é obrigatória").min(6, "A senha deve ter no mínimo 8 caracteres"),
});

export type SigninInput = z.input<typeof signinSchema>;

export type SigninOutput = UserOutput;
