import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  label?: string;
  helper?: string;
  disabled?: boolean;
  invalid?: boolean;
}

export function DatePicker({ value, onChange, label = "Data", helper, disabled, invalid }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor="date-picker-simple">{label}</FieldLabel>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            id="date-picker-simple"
            className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
            disabled={disabled}
          >
            {value ? format(value, "PPP", { locale: ptBR }) : <span>Selecione</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) max-w-80 min-w-72 p-0">
          <Calendar
            mode="single"
            locale={ptBR}
            className="w-full"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setIsOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {helper && <FieldDescription>{helper}</FieldDescription>}
    </Field>
  );
}
