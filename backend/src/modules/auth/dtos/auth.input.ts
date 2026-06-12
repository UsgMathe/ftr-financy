import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export abstract class AuthInput {
  @Field(() => String)
  @IsEmail({}, { message: "Formato de e-mail inválido" })
  @IsNotEmpty({ message: "O e-mail é obrigatório" })
  @MaxLength(100, { message: "O e-mail deve ter no máximo 100 caracteres" })
  email!: string;

  @Field(() => String)
  @IsString({ message: "A senha deve ser uma string" })
  @MinLength(8, { message: "A senha deve ter no mínimo 8 caracteres" })
  @MaxLength(50, { message: "A senha deve ter no máximo 50 caracteres" })
  password!: string;
}