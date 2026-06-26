import { Transaction, TransactionType } from '@/generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/index-browser';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, Float, ID, InputType } from 'type-graphql';

@InputType()
export class CreateTransactionInput implements Partial<Transaction> {
  @Field(() => String)
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MinLength(5, { message: 'A descrição deve ter no mínimo 5 caracteres' })
  @MaxLength(100, { message: 'A descrição deve ter no máximo 100 caracteres' })
  description!: string;

  @Field(() => String)
  @IsString({ message: 'A data deve ser uma string' })
  @IsNotEmpty({ message: 'A data é obrigatória' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'A data deve estar no formato yyyy-MM-dd',
  })
  date!: string;

  @Field(() => Float)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com até 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor deve ser maior que 0' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  amount?: Decimal;

  @Field(() => TransactionType)
  @IsEnum(TransactionType, {
    message: `O tipo deve ser válido (${TransactionType.EXPENSE}, ${TransactionType.INCOME})`,
  })
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  type!: TransactionType;

  @Field(() => ID)
  @IsString({ message: 'O ID da categoria deve ser uma string' })
  @IsNotEmpty({ message: 'O ID da categoria é obrigatório' })
  categoryId!: string;
}
