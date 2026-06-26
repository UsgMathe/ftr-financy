import { TransactionTypeEnum, type TransactionType } from "@/graphql/transactions/transaction.model";
import { formatCurrency } from "@/utils/format-currency";

interface AmountTextProps {
  type?: TransactionType;
  amount: number;
}
export function AmountText({ type, amount }: AmountTextProps) {
  const isIncome = type === TransactionTypeEnum.INCOME;

  return (
    <div className="text-right text-base font-semibold text-nowrap">
      {type && (isIncome ? "+" : "-")} {formatCurrency(amount)}
    </div>
  );
}
