import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { CreateCategoryInput } from './create-category.dto';

@InputType()
export class UpdateCategoryInput implements Partial<CreateCategoryInput> {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O título deve ter no máximo 100 caracteres' })
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'A cor deve ser uma string' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'A cor deve estar no formato hexadecimal (#RRGGBB)',
  })
  color?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'O ícone deve ser uma string' })
  @MinLength(1, { message: 'O ícone deve ter no mínimo 1 caractere' })
  @MaxLength(50, { message: 'O ícone deve ter no máximo 50 caracteres' })
  icon?: string;
}
