import { Field, InputType, ObjectType } from 'type-graphql';
import { UserModel } from '../models/user.model';

@InputType()
export class SignupInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType()
export class SignupOutput {
  @Field(() => String)
  token!: string;

  @Field(() => String)
  refreshToken!: string;

  @Field(() => UserModel)
  user!: UserModel;
}
