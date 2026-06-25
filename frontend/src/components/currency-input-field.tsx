import React from "react";
import { InputField, type InputFieldProps } from "./input-field";

export function CurrencyInputField({ onKeyDown, onInput, ...props }: InputFieldProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
    onKeyDown?.(event);
  };

  const handleInput: InputFieldProps["onInput"] = (event) => {
    const input = event.currentTarget;
    const value = input.value;

    if (value.includes(".")) {
      const [integer, decimal] = value.split(".");

      if (decimal && decimal.length > 2) {
        input.value = `${integer}.${decimal.slice(0, 2)}`;
      }
    }
    onInput?.(event);
  };

  return (
    <InputField
      type="number"
      step="0.01"
      min="0"
      icon={<p className="text-muted-foreground font-normal">R$</p>}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      {...props}
    />
  );
}
