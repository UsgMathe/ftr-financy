import { LogOutIcon, MailIcon, User2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

import { updateUserSchema, type UpdateUserInput } from "@/schemas/user/user.schema";
import { useAuthStore } from "@/stores/auth.store";
import { getInitials } from "@/utils/get-initials";

import { InputField } from "@/components/input-field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UPDATE_USER_MUTATION } from "@/graphql/users/user.mutations";
import { getErrorMessage } from "@/utils/error.utils";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const signout = useAuthStore((state) => state.signout);

  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name,
    },
  });

  useEffect(() => {
    form.reset({ name: user?.name });
  }, [user]);

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      const response = await updateUserMutation({ variables: { data } });
      setUser(response.data?.updateUser);
    } catch (error) {
      toast.error("Falha ao atualizar usuário", { description: getErrorMessage(error) });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-center">
          <Avatar size="xl" className="mb-4">
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>

          <CardTitle className="text-xl font-bold">{user?.name}</CardTitle>
          <CardDescription className="text-base">{user?.email}</CardDescription>
        </CardHeader>

        <CardContent>
          <Separator className="mt-4 mb-8" />

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
              readOnly
              icon={<MailIcon />}
              helper="O e-mail não pode ser alterado"
            />

            <Button type="submit" className="mt-2 w-full" disabled={form.formState.isSubmitting}>
              <span>Salvar alterações</span>
            </Button>

            <Button variant="outline" className="w-full" disabled={form.formState.isSubmitting} onClick={signout}>
              <LogOutIcon className="text-destructive" />
              <span>Sair da conta</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
