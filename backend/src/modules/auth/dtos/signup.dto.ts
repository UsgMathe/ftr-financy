import { IsString, MaxLength } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';

import { AuthInput } from './auth.input';
import { AuthOutput } from './auth.output';

@InputType()
export class SignupInput extends AuthInput {
  @Field(() => String)
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name!: string;
}

@ObjectType()
export class SignupOutput extends AuthOutput {}
