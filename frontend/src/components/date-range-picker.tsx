import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface StringDateRange {
  from?: string;
  to?: string;
}

interface DateRangePickerProps {
  label?: string;
  helper?: string;
  disabled?: boolean;
  invalid?: boolean;
  value?: StringDateRange;
  onChange?: (value?: StringDateRange) => void;
}

const parseDate = (value?: string) => (value ? parseISO(value) : undefined);

const formatDate = (date?: Date) => (date ? format(date, "yyyy-MM-dd") : undefined);

export function DateRangePicker({
  value,
  onChange,
  label = "Período",
  helper,
  disabled,
  invalid,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const from = parseDate(value?.from);
  const to = parseDate(value?.to);

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor="date-range-picker">{label}</FieldLabel>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            id="date-range-picker"
            variant="outline"
            disabled={disabled}
            className={cn("w-full justify-start text-left font-normal", !value?.from && "text-muted-foreground")}
          >
            {from ? (
              to ? (
                <>
                  {format(from, "P", { locale: ptBR })} - {format(to, "P", { locale: ptBR })}
                </>
              ) : (
                <>{format(from, "P", { locale: ptBR })} - Selecione o fim</>
              )
            ) : (
              "Selecione"
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) max-w-80 min-w-72 p-0">
          <Calendar
            mode="range"
            locale={ptBR}
            className="w-full"
            selected={{
              from,
              to,
            }}
            onSelect={(range) => {
              onChange?.(
                range
                  ? {
                      from: formatDate(range.from),
                      to: formatDate(range.to),
                    }
                  : undefined,
              );

              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>

      {helper && <FieldDescription>{helper}</FieldDescription>}
    </Field>
  );
}
