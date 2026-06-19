import { Logo, LogoIcon } from "@/assets";
import { MailIcon } from "lucide-react";
import { InputField } from "./components/input-field";
import { SelectField } from "./components/select-field";

export function App() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-20">
      <Logo />
      <LogoIcon />

      <p className="text-2xl font-bold">Inter</p>

      <InputField
        id="email"
        label="Input"
        placeholder="Placeholder"
        helper="Helper"
        icon={<MailIcon />}
        onValueChange={console.log}
      />

      <InputField
        id="email"
        label="Input"
        placeholder="Placeholder"
        helper="Helper"
        invalid
        icon={<MailIcon />}
        onValueChange={console.log}
      />

      <InputField
        id="email"
        disabled
        label="Input"
        placeholder="Placeholder"
        helper="Helper"
        icon={<MailIcon />}
        onValueChange={console.log}
      />

      <SelectField
        label="Label"
        placeholder="Select a fruit"
        items={[
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ]}
        onValueChange={console.log}
      />
    </div>
  );
}
