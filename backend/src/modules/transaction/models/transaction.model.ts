
import { UserModel } from '@/modules/auth/models/user.model';
import { CategoryModel } from '@/modules/category/models/category.model';
import { registerEnumType } from 'type-graphql';
import { Field, Float, GraphQLISODateTime, ID, ObjectType } from 'type-graphql';
import { TransactionType } from '@/generated/prisma/enums';

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  description!: string;

  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => Float)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => UserModel)
  user!: UserModel;

  @Field(() => CategoryModel)
  category!: CategoryModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
