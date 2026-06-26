import { TransactionType } from '@/generated/prisma/enums';
import { IsEnum, IsString, Matches } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ListTransactionsFilterInput {
  @Field(() => String, { nullable: true })
  @IsString()
  search?: string;

  @Field(() => TransactionType, { nullable: true })
  @IsEnum(TransactionType)
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  @IsString()
  categoryId?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate?: string;
}
