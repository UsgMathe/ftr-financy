import { IsString, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { AuthInput } from './auth.input';

@InputType()
export class SignupInput extends AuthInput {
  @Field(() => String)
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name!: string;
}
