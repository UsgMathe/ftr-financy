import { Logo, LogoIcon } from "@/assets";
import { MailIcon, TrashIcon, UserPlus2Icon } from "lucide-react";
import { InputField } from "./components/input-field";
import { SelectField } from "./components/select-field";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";

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
        helper="Helper"
        items={[
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ]}
        onValueChange={console.log}
      />

      <div className="grid w-fit grid-cols-2 gap-10">
        <Button>
          <UserPlus2Icon /> Label
        </Button>

        <Button variant="outline">
          <UserPlus2Icon /> Label
        </Button>

        <Button disabled>
          <UserPlus2Icon /> Label
        </Button>

        <Button disabled variant="outline">
          <UserPlus2Icon /> Label
        </Button>
      </div>

      <div className="grid w-fit grid-cols-2 gap-10">
        <Button size="sm">
          <UserPlus2Icon /> Label
        </Button>

        <Button size="sm" variant="outline">
          <UserPlus2Icon /> Label
        </Button>

        <Button disabled size="sm">
          <UserPlus2Icon /> Label
        </Button>

        <Button disabled size="sm" variant="outline">
          <UserPlus2Icon /> Label
        </Button>
      </div>

      <div className="grid w-fit grid-cols-2 gap-10">
        <Button size="icon" variant="outline">
          <UserPlus2Icon />
        </Button>

        <Button size="icon" variant="outline-destructive">
          <TrashIcon />
        </Button>

        <Button disabled size="icon" variant="outline">
          <UserPlus2Icon />
        </Button>

        <Button disabled size="icon" variant="outline-destructive">
          <TrashIcon />
        </Button>
      </div>

      <div>
        <a href="">Label</a>
      </div>

      <div className="grid w-fit grid-cols-4 gap-10">
        <Badge>Label</Badge>
        <Badge variant="blue">Label</Badge>
        <Badge variant="purple">Label</Badge>
        <Badge variant="pink">Label</Badge>
        <Badge variant="red">Label</Badge>
        <Badge variant="orange">Label</Badge>
        <Badge variant="yellow">Label</Badge>
        <Badge variant="green">Label</Badge>
      </div>
    </div>
  );
}
