import { OrderDirection } from '@/shared/graphql/order-direction.enum';
import { IsString } from 'class-validator';
import { Field, InputType, registerEnumType } from 'type-graphql';

export enum CategoryOrderFieldEnum {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TRANSACTIONS_COUNT = 'transactionsCount',
}

registerEnumType(CategoryOrderFieldEnum, {
  name: 'CategoryOrderField',
});

@InputType()
export class CategoryOrderByInput {
  @Field(() => CategoryOrderFieldEnum, {
    defaultValue: CategoryOrderFieldEnum.TITLE,
  })
  field!: CategoryOrderFieldEnum;

  @Field(() => OrderDirection, {
    nullable: true,
    defaultValue: OrderDirection.DESC,
  })
  direction?: OrderDirection;
}

@InputType()
export class ListCategoriesFilterInput {
  @Field(() => String, { nullable: true })
  @IsString()
  search?: string;

  @Field(() => CategoryOrderByInput, { nullable: true })
  orderBy?: CategoryOrderByInput;
}
