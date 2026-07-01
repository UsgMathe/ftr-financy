import { Field, ObjectType } from 'type-graphql';

import { UserModel } from '../models/user.model';

@ObjectType()
export abstract class AuthOutput {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;

  @Field(() => UserModel)
  user!: UserModel;
}
