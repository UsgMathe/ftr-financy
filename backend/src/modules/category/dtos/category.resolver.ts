import { User } from '@/generated/prisma/client';
import { GqlUser } from '@/graphql/decorators/user.decorator';
import { IsAuth } from '@/shared/middlewares/is-auth.middleware';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { CategoryService } from '../category.service';
import { CategoryModel } from '../models/category.model';
import { CreateCategoryInput } from './create-category.dto';
import { UpdateCategoryInput } from './update-category.dto';

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private readonly categoryService = new CategoryService();

  @Mutation(() => CategoryModel, { description: 'Criar uma categoria' })
  async createCategory(
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: User,
  ) {
    return this.categoryService.createCategory(user.id, data);
  }

  @Mutation(() => CategoryModel, { description: 'Atualizar uma categoria' })
  async updateCategory(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
    @GqlUser() user: User,
  ) {
    return this.categoryService.updateCategory(user.id, id, data);
  }

  @Mutation(() => Boolean, { description: 'Deletar uma categoria' })
  async deleteCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User,
  ) {
    return this.categoryService.deleteCategory(user.id, id);
  }

  @Query(() => CategoryModel, { description: 'Buscar uma categoria' })
  async getCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User,
  ) {
    return this.categoryService.findCategory(user.id, id);
  }

  @Query(() => [CategoryModel], { description: 'Listar as categorias' })
  async listCategories(@GqlUser() user: User) {
    return this.categoryService.listCategories(user.id);
  }
}
