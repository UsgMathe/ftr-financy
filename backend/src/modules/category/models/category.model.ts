import { Category } from '@/generated/prisma/client';
import { UserModel } from '@/modules/auth/models/user.model';
import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class CategoryModel implements Partial<Category> {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => String)
  color!: string;

  @Field(() => String)
  icon!: string;

  @Field(() => UserModel)
  user!: UserModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
