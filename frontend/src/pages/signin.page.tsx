import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon, MailIcon, UserPlus2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { signinSchema, type SigninInput } from "@/schemas/auth/signin.schema";
import { useAuthStore } from "@/stores/auth.store";

import { Logo } from "@/assets";
import { AnchorLink } from "@/components/anchor-link";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { APP_ROUTES_PATHS } from "./routes/app-routes-paths";

export function SigninPage() {
  const signin = useAuthStore((store) => store.signin);

  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninInput) => {
    await signin(data).catch((error) => {
      toast.error("Falha ao logar", { description: error.message });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Logo />

      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Fazer login</CardTitle>
          <CardDescription className="text-base">Entre na sua conta para continuar</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}>
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

            <div className="flex justify-between gap-4">
              <Field orientation="horizontal" className="w-fit">
                <Checkbox id="remember-checkbox" name="remember-checkbox" />
                <Label htmlFor="remember-checkbox">Lembrar-me</Label>
              </Field>

              <AnchorLink href="">Recuperar senha</AnchorLink>
            </div>

            <Button type="submit" className="my-2 w-full" disabled={form.formState.isSubmitting}>
              Entrar
            </Button>

            <div className="mb-2 flex items-center gap-3">
              <Separator className="flex-1" />
              <p className="text-muted-foreground text-sm">ou</p>
              <Separator className="flex-1" />
            </div>

            <p className="text-muted-foreground text-center text-sm">Ainda não tem uma conta?</p>

            <Link to={APP_ROUTES_PATHS.SIGNUP}>
              <Button variant="outline" className="w-full" disabled={form.formState.isSubmitting}>
                <UserPlus2Icon />
                <span>Criar conta</span>
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
