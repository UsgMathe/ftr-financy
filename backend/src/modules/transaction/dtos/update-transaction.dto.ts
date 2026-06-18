import { TransactionType } from '@/generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/index-browser';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, Float, ID, InputType } from 'type-graphql';
import { CreateTransactionInput } from './create-transaction.dto';

@InputType()
export class UpdateTransactionInput implements Partial<CreateTransactionInput> {
  @Field(() => String, { nullable: true })
  @IsString({ message: 'A descrição deve ser uma string' })
  @MinLength(5, { message: 'A descrição deve ter no mínimo 5 caracteres' })
  @MaxLength(100, { message: 'A descrição deve ter no máximo 100 caracteres' })
  description?: string;

  @Field(() => Date, { nullable: true })
  @IsDate({ message: 'A data deve ser uma data válida' })
  date?: Date;

  @Field(() => Float, { nullable: true })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com até 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor deve ser maior que 0' })
  amount?: Decimal;

  @Field(() => TransactionType, { nullable: true })
  @IsEnum(TransactionType, {
    message: `O tipo deve ser válido (${TransactionType.EXPENSE}, ${TransactionType.INCOME})`,
  })
  type?: TransactionType;

  @Field(() => ID, { nullable: true })
  @IsString({ message: 'O ID da categoria deve ser uma string' })
  categoryId?: string;
}
