import { TransactionType } from '@/generated/prisma/enums';
import { OrderDirection } from '@/shared/graphql/order-direction.enum';
import { IsEnum, IsString, Matches } from 'class-validator';
import { Field, InputType, registerEnumType } from 'type-graphql';

export enum TransactionOrderFieldEnum {
  DATE = 'date',
  AMOUNT = 'amount',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

registerEnumType(TransactionOrderFieldEnum, {
  name: 'TransactionOrderField',
});

@InputType()
export class TransactionOrderByInput {
  @Field(() => TransactionOrderFieldEnum, {
    defaultValue: TransactionOrderFieldEnum.DATE,
  })
  field!: TransactionOrderFieldEnum;

  @Field(() => OrderDirection, {
    nullable: true,
    defaultValue: OrderDirection.DESC,
  })
  direction?: OrderDirection;
}

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

  @Field(() => TransactionOrderByInput, { nullable: true })
  orderBy?: TransactionOrderByInput;
}
