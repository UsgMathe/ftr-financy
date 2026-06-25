import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription } from "@/components/ui/field";
import { TransactionTypeEnum } from "@/graphql/transactions/transaction.model";
import { cn } from "@/lib/utils";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";

interface TransactionTypeSwitchProps {
  value?: string;
  onValueChange?: (value: string) => void;
  helper?: string;
  invalid?: boolean;
  disabled?: boolean;
}

export function TransactionTypeSwitch({ value, onValueChange, helper, invalid, disabled }: TransactionTypeSwitchProps) {
  const isExpense = value === TransactionTypeEnum.EXPENSE;
  const isIncome = value === TransactionTypeEnum.INCOME;

  return (
    <Field data-invalid={invalid}>
      <Card className="p-2">
        <CardContent className="grid grid-cols-2 gap-2 p-0">
          <Button
            type="button"
            className={cn(
              "text-base transition-colors",
              isExpense ? "border-destructive bg-gray-100" : "text-muted-foreground",
            )}
            variant={isExpense ? "outline-destructive" : "ghost"}
            onClick={() => onValueChange?.(TransactionTypeEnum.EXPENSE)}
            disabled={disabled}
          >
            <ArrowDownCircleIcon />
            <span>Despesa</span>
          </Button>
          <Button
            type="button"
            className={cn(
              "text-base transition-colors",
              isIncome ? "border-brand-base text-brand-base bg-gray-100" : "text-muted-foreground",
            )}
            variant={isIncome ? "outline" : "ghost"}
            onClick={() => onValueChange?.(TransactionTypeEnum.INCOME)}
            disabled={disabled}
          >
            <ArrowUpCircleIcon />
            <span>Receita</span>
          </Button>
        </CardContent>
      </Card>
      {helper && <FieldDescription>{helper}</FieldDescription>}
    </Field>
  );
}
