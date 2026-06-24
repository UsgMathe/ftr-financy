import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";

import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { CATEGORY_COLORS } from "@/constants/category-colors";
import { CATEGORY_ICONS } from "@/constants/category-icons";
import { type CreateCategoryInput, createCategorySchema } from "@/schemas/categories/categories.schema";
import { ColorButton } from "./color-button";
import { IconButton } from "./icon-button";

interface CreateCategoryDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: CreateCategoryInput, form: UseFormReturn<CreateCategoryInput>) => any;
}
export function CreateCategoryDialog({ open, onOpenChange, onSubmit }: CreateCategoryDialogProps) {
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      color: "",
    },
  });

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    form.reset();
  };

  const handleSubmit = async (data: CreateCategoryInput) => {
    await onSubmit?.(data, form);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
            <DialogDescription>Organize suas transações com categorias</DialogDescription>
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
            {isSubmitting ? "Salvando" : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
