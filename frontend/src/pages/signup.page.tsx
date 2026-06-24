import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon, LogInIcon, MailIcon, User2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { signupSchema, type SignupInput } from "@/schemas/auth/signup.schema";
import { useAuthStore } from "@/stores/auth.store";

import { Logo } from "@/assets";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((store) => store.signup);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      await signup(data);
      toast.success("Conta criada", { description: "Você já pode fazer o login." });
      navigate("/signin");
    } catch (error) {
      console.log(error.errors);
      if (error instanceof Error) {
        toast.error("Falha ao criar conta", { description: error.message });
      } else {
        toast.error("Falha ao criar conta", { description: "Tente novamente mais tarde." });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Logo />

      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Criar conta</CardTitle>
          <CardDescription className="text-base">Comece a controlar suas finanças ainda hoje</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}>
            <InputField
              label="Nome completo"
              placeholder="Seu nome completo"
              icon={<User2Icon />}
              invalid={!!form.formState.errors.name}
              helper={form.formState.errors.name?.message}
              disabled={form.formState.isSubmitting}
              {...form.register("name")}
            />

            <InputField
              label="E-mail"
              type="email"
              placeholder="mail@exemplo.com"
              icon={<MailIcon />}
              invalid={!!form.formState.errors.email}
              helper={form.formState.errors.email?.message}
              disabled={form.formState.isSubmitting}
              {...form.register("email")}
            />

            <InputField
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              icon={<LockIcon />}
              invalid={!!form.formState.errors.password}
              helper={form.formState.errors.password?.message}
              disabled={form.formState.isSubmitting}
              {...form.register("password")}
            />

            <Button type="submit" className="my-2 w-full" disabled={form.formState.isSubmitting}>
              Cadastrar
            </Button>

            <div className="mb-2 flex items-center gap-3">
              <Separator className="flex-1" />
              <p className="text-muted-foreground text-sm">ou</p>
              <Separator className="flex-1" />
            </div>

            <p className="text-muted-foreground text-center text-sm">Já tem uma conta?</p>

            <Link to="/signin">
              <Button variant="outline" className="w-full" disabled={form.formState.isSubmitting}>
                <LogInIcon />
                <span>Fazer login</span>
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
