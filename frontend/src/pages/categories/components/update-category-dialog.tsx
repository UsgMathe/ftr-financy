import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import type { CategoryModel } from "@/graphql/categories/category.model";
import { type UpdateCategoryInput, updateCategorySchema } from "@/schemas/categories/categories.schema";

import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { CATEGORY_COLORS } from "@/constants/category-colors";
import { CATEGORY_ICONS } from "@/constants/category-icons";
import { UPDATE_CATEGORY_MUTATION } from "@/graphql/categories/categories.mutations";
import { useMutation } from "@apollo/client/react";
import { Loader2Icon } from "lucide-react";
import { ColorButton } from "./color-button";
import { IconButton } from "./icon-button";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error.utils";

interface UpdateCategoryDialogProps {
  category?: CategoryModel;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (data?: CategoryModel) => void;
  onError?: (error: unknown) => void;
}
export function UpdateCategoryDialog({ category, open, onOpenChange, onSuccess, onError }: UpdateCategoryDialogProps) {
  const form = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      title: category?.title || "",
      description: category?.description || "",
      icon: category?.icon || "",
      color: category?.color || "",
    },
  });

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    form.reset();
  };

  const [updateCategoryMutation] = useMutation(UPDATE_CATEGORY_MUTATION);

  const handleUpdateCategory = async (data: UpdateCategoryInput) => {
    if (!category) return;

    try {
      const result = await updateCategoryMutation({ variables: { categoryId: category.id, data } });
      onSuccess?.(result.data?.updateCategory);
      handleOpenChange(false);
      form.reset();
    } catch (error) {
      onError?.(error);
      toast.error("Falha ao editar categoria", {
        description: getErrorMessage(error),
        position: "top-center",
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({
      title: category?.title || "",
      description: category?.description || "",
      icon: category?.icon || "",
      color: category?.color || "",
    });
  }, [category]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleUpdateCategory)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Editar categoria</DialogTitle>
            <DialogDescription>Edite as informações da categoria</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <InputField
              label="Título"
              placeholder="Ex. Alimentação"
              invalid={!!form.formState.errors.title}
              helper={form.formState.errors.title?.message}
              disabled={isSubmitting}
              {...form.register("title")}
            />

            <InputField
              label="Descrição da categoria"
              placeholder="Ex. Alimentação"
              invalid={!!form.formState.errors.description}
              helper={form.formState.errors.description?.message || "Opcional"}
              disabled={isSubmitting}
              {...form.register("description")}
            />

            <Controller
              control={form.control}
              name="icon"
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel>Ícone</FieldLabel>
                  <FieldContent className="grid w-full grid-cols-8 gap-2">
                    {CATEGORY_ICONS.map((icon, index) => (
                      <IconButton
                        key={`${icon}-${index}`}
                        icon={icon}
                        selected={field.value === icon}
                        onClick={field.onChange}
                        disabled={isSubmitting}
                      />
                    ))}
                  </FieldContent>
                  {fieldState.error && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="color"
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel>Cor</FieldLabel>
                  <FieldContent className="grid w-full grid-cols-7 gap-2">
                    {CATEGORY_COLORS.map((color, index) => (
                      <ColorButton
                        key={`${color}-${index}`}
                        selected={field.value === color}
                        color={color}
                        onClick={field.onChange}
                        disabled={isSubmitting}
                      />
                    ))}
                  </FieldContent>
                  {fieldState.error && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                </Field>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                <span>Salvando</span>
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
