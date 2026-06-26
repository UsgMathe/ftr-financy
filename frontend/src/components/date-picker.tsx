import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  label?: string;
  helper?: string;
  disabled?: boolean;
  invalid?: boolean;
  value?: string;
  onChange?: (date?: string) => void;
}

const parseDate = (value?: string) => (value ? parseISO(value) : undefined);

const formatDate = (date?: Date) => (date ? format(date, "yyyy-MM-dd") : undefined);

export function DatePicker({ value, onChange, label = "Data", helper, disabled, invalid }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = parseDate(value);

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor="date-picker">{label}</FieldLabel>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            id="date-picker"
            variant="outline"
            disabled={disabled}
            className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            {selected ? format(selected, "PPP", { locale: ptBR }) : "Selecione"}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) max-w-80 min-w-72 p-0">
          <Calendar
            mode="single"
            locale={ptBR}
            className="w-full"
            selected={selected}
            onSelect={(date) => {
              onChange?.(formatDate(date));
              setIsOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {helper && <FieldDescription>{helper}</FieldDescription>}
    </Field>
  );
}
