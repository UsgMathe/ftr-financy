import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'O email deve ser uma string' })
  @MinLength(3, { message: 'O email deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O email deve ter no máximo 100 caracteres' })
  email?: string;
}
