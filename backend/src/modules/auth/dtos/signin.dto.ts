import { InputType, ObjectType } from 'type-graphql';
import { AuthInput } from './auth.input';
import { AuthOutput } from './auth.output';

@InputType()
export class SigninInput extends AuthInput { }

@ObjectType()
export class SigninOutput extends AuthOutput { }
