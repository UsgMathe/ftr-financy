import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";

import type { CategoryModel } from "@/graphql/categories/category.model";
import { type UpdateCategoryInput, updateCategorySchema } from "@/schemas/categories/categories.schema";

import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { CATEGORY_COLORS } from "@/constants/category-colors";
import { CATEGORY_ICONS } from "@/constants/category-icons";
import { ColorButton } from "./color-button";
import { IconButton } from "./icon-button";

interface UpdateCategoryDialogProps {
  category?: CategoryModel;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (id: CategoryModel["id"], data: UpdateCategoryInput, form: UseFormReturn<UpdateCategoryInput>) => any;
}
export function UpdateCategoryDialog({ category, open, onOpenChange, onSubmit }: UpdateCategoryDialogProps) {
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

  const handleSubmit = async (data: UpdateCategoryInput) => {
    await onSubmit?.(category?.id!, data, form);
  };

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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              disabled={form.formState.isSubmitting}
              {...form.register("title")}
            />

            <InputField
              label="Descrição da categoria"
              placeholder="Ex. Alimentação"
              invalid={!!form.formState.errors.description}
              helper={form.formState.errors.description?.message || "Opcional"}
              disabled={form.formState.isSubmitting}
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
                      />
                    ))}
                  </FieldContent>
                  {fieldState.error && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                </Field>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
