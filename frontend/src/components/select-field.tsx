import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Field, FieldDescription, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectProps,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

export type SelectFieldItem = {
  label: string;
  value: string;
};

type SelectFieldProps = SelectProps & {
  label: string;
  placeholder?: string;
  items: SelectFieldItem[];
  helper?: string;
  invalid?: boolean;

  isClearable?: boolean;

  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};

const CLEAR_VALUE = "CLEAR_SELECTION";

export function SelectField({
  label,
  placeholder = "Selecione",
  items,
  helper,
  invalid,
  hasNextPage = false,
  isFetchingNextPage = false,
  isClearable = false,
  value,
  onLoadMore,
  onValueChange,
  ...props
}: SelectFieldProps) {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const handleValueChange = (newValue: string) => {
    if (newValue === CLEAR_VALUE) {
      onValueChange?.("");
    } else {
      onValueChange?.(newValue);
    }
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <Field data-invalid={invalid}>
      <FieldLabel>{label}</FieldLabel>

      <Select value={value || ""} onValueChange={handleValueChange} {...props}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent position="popper">
          <SelectGroup>
            {isClearable && value && (
              <SelectItem value={CLEAR_VALUE} className="text-muted-foreground focus:text-muted-foreground italic">
                Nenhum (Limpar)
              </SelectItem>
            )}

            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}

            {isFetchingNextPage && (
              <div className="my-1 space-y-2 px-1">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            )}
          </SelectGroup>

          {hasNextPage && <div ref={ref} className="h-2" />}
        </SelectContent>
      </Select>

      {helper && <FieldDescription>{helper}</FieldDescription>}
    </Field>
  );
}
