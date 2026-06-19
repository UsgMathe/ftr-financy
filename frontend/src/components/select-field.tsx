import { Field, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectProps,
} from "./ui/select";

type SelectFieldProps = SelectProps & {
  label: string;
  placeholder?: string;
  items: {
    label: string;
    value: string;
  }[];
};

export function SelectField({ label, placeholder, items, ...props }: SelectFieldProps) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>

      <Select {...props}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent position="popper">
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
