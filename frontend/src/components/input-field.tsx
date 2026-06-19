import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

type InputFieldProps = React.ComponentProps<"input"> & {
  label: string;
  helper?: string;
  invalid?: boolean;
  icon?: React.ReactNode;
  onValueChange?: (value: string) => void;
};

export function InputField({ id, label, helper, invalid, icon, onValueChange, ...props }: InputFieldProps) {
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <InputGroup>
        <InputGroupInput
          id={id}
          {...props}
          onChange={(e) => {
            onValueChange?.(e.target.value);
            props.onChange?.(e);
          }}
        />

        {icon && <InputGroupAddon align="inline-start">{icon}</InputGroupAddon>}
      </InputGroup>

      {helper && <FieldDescription>{helper}</FieldDescription>}
    </Field>
  );
}
