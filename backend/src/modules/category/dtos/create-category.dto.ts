import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O título deve ter no máximo 100 caracteres' })
  title!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  description?: string;

  @Field(() => String)
  @IsString({ message: 'A cor deve ser uma string' })
  @IsNotEmpty({ message: 'A cor é obrigatória' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'A cor deve estar no formato hexadecimal (#RRGGBB)',
  })
  color!: string;

  @Field(() => String)
  @IsString({ message: 'O ícone deve ser uma string' })
  @IsNotEmpty({ message: 'O ícone é obrigatório' })
  @MinLength(1, { message: 'O ícone deve ter no mínimo 1 caractere' })
  @MaxLength(50, { message: 'O ícone deve ter no máximo 50 caracteres' })
  icon!: string;
}
