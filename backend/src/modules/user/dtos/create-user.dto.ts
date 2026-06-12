import { UserRole } from '@/graphql/enums/user-role.enum';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @Field(() => String)
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @Field(() => String)
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password!: string;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  role?: UserRole;
}
