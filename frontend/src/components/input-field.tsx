import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export type InputFieldProps = React.ComponentProps<"input"> & {
  label: string;
  helper?: string;
  invalid?: boolean;
  icon?: React.ReactNode;
  iconAlign?: "inline-start" | "inline-end" | "block-start" | "block-end" | null;
  onValueChange?: (value: string) => void;
};

export function InputField({
  id,
  label,
  helper,
  invalid,
  icon,
  iconAlign = "inline-start",
  onValueChange,
  ...props
}: InputFieldProps) {
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <InputGroup>
        <InputGroupInput
          id={id}
          onChange={(e) => {
            onValueChange?.(e.target.value);
            props.onChange?.(e);
          }}
          {...props}
        />

        {icon && <InputGroupAddon align={iconAlign}>{icon}</InputGroupAddon>}
      </InputGroup>

      {helper && <FieldDescription>{helper}</FieldDescription>}
    </Field>
  );
}
